// Appointment management module exports (using order system for appointments)
export { default as AppointmentList } from "./OrderList";
export { default as AppointmentForm } from "./OrderForm";
export { default as AppointmentDetail } from "./OrderDetail";

// Keep old exports for backward compatibility
export { default as OrderList } from "./OrderList";
export { default as OrderForm } from "./OrderForm";
export { default as OrderDetail } from "./OrderDetail";
export * from "./orderAPI";
