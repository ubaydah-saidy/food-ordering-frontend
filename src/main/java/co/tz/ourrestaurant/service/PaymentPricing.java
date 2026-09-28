package co.tz.ourrestaurant.service;

public final class PaymentPricing {
    private PaymentPricing() {}

    public static long transactionFee(String method, long amount) {
        boolean aboveThreshold = amount > 20_000;
        return switch (method) {
            case "Vodacom M-Pesa" -> aboveThreshold ? 600 : 400;
            case "TigoPesa" -> aboveThreshold ? 550 : 350;
            case "Airtel Money" -> aboveThreshold ? 500 : 350;
            case "Halopesa" -> aboveThreshold ? 450 : 300;
            case "Visa/Mastercard" -> Math.round(amount * 0.015);
            default -> throw new IllegalArgumentException("Unsupported payment method.");
        };
    }
}