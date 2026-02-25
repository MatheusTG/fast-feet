export interface OrderFilters {
  recipientId?: string;
  deliverymanId?: string;
  status?: string;
  createdAfter?: Date;
  createdBefore?: Date;
  postedAfter?: Date;
  postedBefore?: Date;
  deliveredAfter?: Date;
  deliveredBefore?: Date;
}
