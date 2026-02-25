import React, { FC, useState, useEffect, useCallback, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon, PlusCircle, Trash2, Loader2 } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Lead } from "../types"; // Import Lead type
import { useAuth } from "@/features/partner/auth/AuthContext"; // Import useAuth
import { useToast } from "@/hooks/use-toast"; // Import useToast

interface GenerateInvoiceFormProps {
  lead: Lead;
}

// Zod schema for a single invoice item
const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  qty: z.coerce.number().min(1, "Quantity must be at least 1"),
  unitRate: z.coerce.number().min(0, "Unit rate cannot be negative"),
  amount: z.coerce.number(), // Calculated field
});

// Zod schema for the form
const formSchema = z.object({
  header: z.object({
    invoiceNo: z.string().min(1, "Invoice number is required"),
    dueDate: z.string({
      required_error: "A due date is required.",
    }),
    orderBookingId: z.string(), // This will be pre-filled from leadId
  }),
  billTo: z.object({
    customer: z.object({
      name: z.string().min(1, "Customer name is required"),
      address: z.string().min(1, "Customer address is required"),
      phone: z.string().min(1, "Customer phone is required"),
    }),
  }),
  shipTo: z.object({
    address: z.string().min(1, "Shipping address is required"),
    moveDate: z.string({
      required_error: "A move date is required.",
    }),
    orderBookingId: z.string(), // This will be pre-filled from leadId
  }),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  summary: z.object({
    subtotal: z.coerce.number(),
    discount: z.coerce.number().default(0),
    cgst: z.coerce.number(),
    sgst: z.coerce.number(),
    totalInvoiceValue: z.coerce.number(),
    advancePaid: z.coerce.number().default(0),
    balanceDue: z.coerce.number(),
  }),
});

type InvoiceFormValues = z.infer<typeof formSchema>;

// Helper to map move size to invoice type
const getInvoiceTypeFromMoveSize = (moveSize: string): "1BHK" | "2BHK" | "3BHK" | "Custom" => {
  const normalized = moveSize.toLowerCase().replace(/\s+/g, '');
  if (normalized.includes('1bhk') || normalized.includes('1 bhk')) return "1BHK";
  if (normalized.includes('2bhk') || normalized.includes('2 bhk')) return "2BHK";
  if (normalized.includes('3bhk') || normalized.includes('3 bhk')) return "3BHK";
  return "Custom";
};

export const GenerateInvoiceForm: FC<GenerateInvoiceFormProps> = ({ lead }) => {
  const [invoiceType, setInvoiceType] = useState<"1BHK" | "2BHK" | "3BHK" | "Custom">(() => 
    getInvoiceTypeFromMoveSize(lead.moveDetails.moveSize)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const balanceDueIsDriverRef = useRef(false);
  const balanceDueValueRef = useRef<number>(0);
  const { getToken } = useAuth();
  const { toast } = useToast();


  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      header: {
        invoiceNo: "",
        dueDate: lead.moveDetails.desiredMoveOutDate, // Populated from lead
        orderBookingId: lead.leadKey,
      },
      billTo: {
        customer: {
          name: lead.name, // Populated from lead
          address: "", // Keep as is, as lead does not have a general address
          phone: lead.phoneNumber, // Populated from lead
        },
      },
      shipTo: {
        address: "", // Keep as is, as lead does not have a general shipping address
        moveDate: lead.moveDetails.desiredMoveOutDate, // Populated from lead
        orderBookingId: lead.leadKey,
      },
      items: [
        {
          description: "Packing & Moving Service",
          qty: 1,
          unitRate: 0,
          amount: 0,
        },
      ],
      summary: {
        subtotal: 0,
        discount: 0,
        cgst: 0,
        sgst: 0,
        totalInvoiceValue: 0,
        advancePaid: 0,
        balanceDue: 0,
      },
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const watchAllFields = form.watch(); // Watch all fields for recalculations

  const calculateSummary = useCallback(() => {
    const currentItems = form.getValues("items");
    let discount = form.getValues("summary.discount") || 0;
    const advancePaid = form.getValues("summary.advancePaid") || 0;

    // Subtotal from qty × unit rate; amount is always computed (read-only in UI)
    let newSubtotal = 0;
    currentItems.forEach((item, index) => {
      const itemAmount = Math.ceil((item.qty ?? 0) * (item.unitRate ?? 0));
      form.setValue(`items.${index}.amount`, itemAmount);
      newSubtotal += itemAmount;
    });
    newSubtotal = Math.ceil(newSubtotal);

    // If user just drove by balance due, derive discount from the value they entered (ref, not form state, to avoid stale form value)
    const balanceDueWasDriver = balanceDueIsDriverRef.current;
    if (balanceDueWasDriver) {
      const balanceDue = Number(balanceDueValueRef.current) || 0;
      const advanceNum = Number(advancePaid) || 0;
      const totalInvoiceValueTarget = balanceDue + advanceNum;
      const taxableAmountTarget = totalInvoiceValueTarget / 1.18;
      const discountTarget = newSubtotal - taxableAmountTarget;
      discount = Math.max(0, Math.min(newSubtotal, Math.round(discountTarget)));
      form.setValue("summary.discount", discount);
      // Do not clear the ref here: effect can run again when discount updates; keep ref so we don't overwrite balance due
    }

    const taxableAmount = newSubtotal - discount;
    const cgst = Math.ceil(taxableAmount * 0.09); // Round up CGST
    const sgst = Math.ceil(taxableAmount * 0.09); // Round up SGST
    const totalInvoiceValue = Math.ceil(taxableAmount + cgst + sgst); // Round up totalInvoiceValue
    const balanceDue = Math.ceil(totalInvoiceValue - advancePaid); // Round up balanceDue

    form.setValue("summary.subtotal", newSubtotal);
    form.setValue("summary.cgst", cgst);
    form.setValue("summary.sgst", sgst);
    form.setValue("summary.totalInvoiceValue", totalInvoiceValue);
    if (!balanceDueWasDriver) {
      form.setValue("summary.balanceDue", balanceDue);
    }
  }, [form]);

  useEffect(() => {
    calculateSummary();
  }, [watchAllFields.items, watchAllFields.summary.discount, watchAllFields.summary.advancePaid, watchAllFields.summary.balanceDue, calculateSummary]);

  // Placeholder logic for 1BHK/2BHK/3BHK
  useEffect(() => {
    if (invoiceType !== "Custom") {
      let prefilledItems = [];
      let prefilledSummary = {
        subtotal: 0,
        discount: 0,
        cgst: 0,
        sgst: 0,
        totalInvoiceValue: 0,
        advancePaid: 0,
        balanceDue: 0,
      };

      if (invoiceType === "1BHK") {
        const unitRate = 14000;
        const discount = 8916;
        prefilledItems = [
          { description: "Packing & Moving Service - 1BHK", qty: 1, unitRate: unitRate, amount: Math.ceil(unitRate) },
        ];
        prefilledSummary.subtotal = Math.ceil(unitRate);
        prefilledSummary.discount = discount;
        const taxableAmount = prefilledSummary.subtotal - prefilledSummary.discount;
        prefilledSummary.cgst = Math.ceil(taxableAmount * 0.09);
        prefilledSummary.sgst = Math.ceil(taxableAmount * 0.09);
        prefilledSummary.totalInvoiceValue = Math.ceil(taxableAmount + prefilledSummary.cgst + prefilledSummary.sgst);
        prefilledSummary.advancePaid = 0;
        prefilledSummary.balanceDue = Math.ceil(prefilledSummary.totalInvoiceValue);
            } else if (invoiceType === "2BHK") {
              const unitRate = 22000;
              const discount = 13526;
              prefilledItems = [
                { description: "Packing & Moving Service - 2BHK", qty: 1, unitRate: unitRate, amount: Math.ceil(unitRate) },
              ];
              prefilledSummary.subtotal = Math.ceil(unitRate);
              prefilledSummary.discount = discount;
              const taxableAmount = prefilledSummary.subtotal - prefilledSummary.discount;
              prefilledSummary.cgst = Math.ceil(taxableAmount * 0.09);
              prefilledSummary.sgst = Math.ceil(taxableAmount * 0.09);
              prefilledSummary.totalInvoiceValue = Math.ceil(taxableAmount + prefilledSummary.cgst + prefilledSummary.sgst);
              prefilledSummary.advancePaid = 0;
              prefilledSummary.balanceDue = Math.ceil(prefilledSummary.totalInvoiceValue);
            } else if (invoiceType === "3BHK") {
        const unitRate = 30000;
        const discount = 17289;
        prefilledItems = [
          { description: "Packing & Moving Service - 3BHK", qty: 1, unitRate: unitRate, amount: Math.ceil(unitRate) },
        ];
        prefilledSummary.subtotal = Math.ceil(unitRate);
        prefilledSummary.discount = discount;
        const taxableAmount = prefilledSummary.subtotal - prefilledSummary.discount;
        prefilledSummary.cgst = Math.ceil(taxableAmount * 0.09);
        prefilledSummary.sgst = Math.ceil(taxableAmount * 0.09);
        prefilledSummary.totalInvoiceValue = Math.ceil(taxableAmount + prefilledSummary.cgst + prefilledSummary.sgst);
        prefilledSummary.advancePaid = 0;
        prefilledSummary.balanceDue = Math.ceil(prefilledSummary.totalInvoiceValue);
      }

      form.setValue("items", prefilledItems);
      form.setValue("summary", prefilledSummary);
      calculateSummary(); // Recalculate to ensure amounts are correct
    }
  }, [invoiceType, form, calculateSummary]);


  const onSubmit = async (data: InvoiceFormValues) => {
    const API_BASE_URL = import.meta.env.VITE_BACKEND_API_URL;
    const token = getToken();
    if (!token) {
      toast({
        title: "Authentication Error",
        description: "No authorization token found. Please log in.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/generate-invoice`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Assuming the API returns a file directly
        const blob = await response.blob();
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = `invoice_${data.header.invoiceNo}.pdf`; // Default filename

        if (contentDisposition) {
          const filenameMatch = contentDisposition.match(/filename="([^"]+)"/);
          if (filenameMatch && filenameMatch[1]) {
            filename = filenameMatch[1];
          }
        }

        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);

        toast({
          title: "Invoice Generated",
          description: "Invoice downloaded successfully.",
        });
      } else {
        const errorText = await response.text();
        toast({
          title: "Error Generating Invoice",
          description: `Failed to generate invoice: ${response.status} ${response.statusText} - ${errorText}`,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error generating invoice:", error);
      toast({
        title: "Network Error",
        description: `Could not connect to the server: ${error.message}`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Invoice Type Selection */}
        <div className="grid grid-cols-2 gap-4">
          <FormItem>
            <FormLabel>Invoice Type</FormLabel>
            <Select value={invoiceType} onValueChange={(value: "1BHK" | "2BHK" | "3BHK" | "Custom") => {
              setInvoiceType(value);
              // Reset items if switching to/from Custom
              if (value === "Custom") {
                form.setValue("items", [{ description: "Custom Service", qty: 1, unitRate: 0, amount: 0 }]);
              } else {
                form.setValue("items", []); // Will be re-populated by useEffect
              }
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Select Invoice Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1BHK">1BHK</SelectItem>
                <SelectItem value="2BHK">2BHK</SelectItem>
                <SelectItem value="3BHK">3BHK</SelectItem>
                <SelectItem value="Custom">Custom</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        </div>

        {/* Header Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="header.invoiceNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Invoice No.</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="header.dueDate"
            render={({ field }) => (
              <FormItem className="flex flex-col justify-end">
                <FormLabel>Due Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal h-10 hover:bg-accent hover:text-accent-foreground",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Bill To Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Bill To</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="billTo.customer.name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="billTo.customer.phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Phone</FormLabel>
                  <FormControl>
                    <Input type="tel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="mt-4">
            <FormField
              control={form.control}
              name="billTo.customer.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Enter full billing address"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Ship To Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Ship To</h3>
          <div className="grid grid-cols-1 gap-4">
            <FormField
              control={form.control}
              name="shipTo.address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      rows={3}
                      placeholder="Enter full shipping address"
                      className="resize-none"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shipTo.moveDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Move Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal h-10 hover:bg-accent hover:text-accent-foreground",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? format(new Date(field.value), "PPP") : <span>Pick a date</span>}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value ? new Date(field.value) : undefined}
                        onSelect={(date) => field.onChange(date ? format(date, "yyyy-MM-dd") : "")}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Items Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Items</h3>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div key={field.id} className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-end rounded-md border p-4">
                <FormField
                  control={form.control}
                  name={`items.${index}.description`}
                  render={({ field: itemField }) => (
                    <FormItem className="sm:col-span-2">
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...itemField}
                          placeholder={invoiceType !== "Custom" && index === 0 ? undefined : "e.g. Extra packing, storage"}
                          disabled={invoiceType !== "Custom" && index === 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.qty`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Qty</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...itemField}
                          onChange={(e) => {
                            const qty = parseFloat(e.target.value);
                            itemField.onChange(qty);
                            const rate = form.getValues(`items.${index}.unitRate`) ?? 0;
                            form.setValue(`items.${index}.amount`, Math.ceil(qty * rate));
                            calculateSummary();
                          }}
                          disabled={invoiceType !== "Custom" && index === 0}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`items.${index}.unitRate`}
                  render={({ field: itemField }) => (
                    <FormItem>
                      <FormLabel>Unit Rate</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...itemField}
                          onChange={(e) => {
                            const rate = parseFloat(e.target.value);
                            itemField.onChange(rate);
                            const qty = form.getValues(`items.${index}.qty`) ?? 0;
                            form.setValue(`items.${index}.amount`, Math.ceil(qty * rate));
                            calculateSummary();
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={form.watch(`items.${index}.amount`) ?? ""}
                      readOnly
                      className="bg-muted"
                    />
                  </FormControl>
                </FormItem>
                {((invoiceType === "Custom" && fields.length > 1) || (invoiceType !== "Custom" && index > 0)) && (
                  <Button type="button" variant="destructive" size="icon" onClick={() => { remove(index); calculateSummary(); }}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                append({ description: "Custom item", qty: 1, unitRate: 0, amount: 0 });
                calculateSummary();
              }}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add custom item
            </Button>
          </div>
        </div>

        {/* Summary Section */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <FormItem>
              <FormLabel>Subtotal</FormLabel>
              <Input value={form.getValues("summary.subtotal")} readOnly />
            </FormItem>
            <FormField
              control={form.control}
              name="summary.discount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        balanceDueIsDriverRef.current = false;
                        field.onChange(e);
                        calculateSummary();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem>
              <FormLabel>CGST (9%)</FormLabel>
              <Input value={form.getValues("summary.cgst")} readOnly />
            </FormItem>
            <FormItem>
              <FormLabel>SGST (9%)</FormLabel>
              <Input value={form.getValues("summary.sgst")} readOnly />
            </FormItem>
            <FormItem>
              <FormLabel>Total Invoice Value</FormLabel>
              <Input value={form.getValues("summary.totalInvoiceValue")} />
            </FormItem>
            <FormField
              control={form.control}
              name="summary.advancePaid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Advance Paid</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => {
                        balanceDueIsDriverRef.current = false;
                        field.onChange(e);
                        calculateSummary();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="summary.balanceDue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Balance Due</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const raw = e.target.value;
                        const balanceDueVal = raw === "" ? 0 : parseFloat(raw) || 0;
                        field.onChange(balanceDueVal);
                        balanceDueIsDriverRef.current = true;
                        balanceDueValueRef.current = balanceDueVal;
                        const advancePaid = form.getValues("summary.advancePaid") || 0;
                        const currentItems = form.getValues("items");
                        let subtotal = 0;
                        currentItems.forEach((item) => {
                          subtotal += Math.ceil((item.qty ?? 0) * (item.unitRate ?? 0));
                        });
                        subtotal = Math.ceil(subtotal);
                        const totalInvoiceValueTarget = balanceDueVal + advancePaid;
                        const taxableAmountTarget = totalInvoiceValueTarget / 1.18;
                        const discountTarget = subtotal - taxableAmountTarget;
                        const discountClamped = Math.max(0, Math.min(subtotal, Math.round(discountTarget)));
                        form.setValue("summary.subtotal", subtotal);
                        form.setValue("summary.discount", discountClamped);
                        const taxableAmount = subtotal - discountClamped;
                        const cgst = Math.ceil(taxableAmount * 0.09);
                        const sgst = Math.ceil(taxableAmount * 0.09);
                        const totalInvoiceValue = Math.ceil(taxableAmount + cgst + sgst);
                        form.setValue("summary.cgst", cgst);
                        form.setValue("summary.sgst", sgst);
                        form.setValue("summary.totalInvoiceValue", totalInvoiceValue);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isSubmitting ? "Generating..." : "Generate Invoice"}
        </Button>
      </form>
    </Form>
  );
};