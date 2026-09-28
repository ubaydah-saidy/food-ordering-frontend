package co.tz.ourrestaurant.service;

import co.tz.ourrestaurant.model.OrderStatus;

public final class OrderTransitions {
    private OrderTransitions() {}

    public static boolean canTransition(OrderStatus current, OrderStatus next) {
        return (current == OrderStatus.ASSIGNED && (next == OrderStatus.IN_PREPARATION || next == OrderStatus.OUT_FOR_DELIVERY))
            || (current == OrderStatus.IN_PREPARATION && next == OrderStatus.OUT_FOR_DELIVERY)
            || (current == OrderStatus.OUT_FOR_DELIVERY && next == OrderStatus.DELIVERED);
    }
}