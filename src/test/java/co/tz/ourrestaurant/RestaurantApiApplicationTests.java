package co.tz.ourrestaurant;

import org.junit.jupiter.api.Test;
import static org.assertj.core.api.Assertions.assertThat;

import co.tz.ourrestaurant.model.OrderStatus;
import co.tz.ourrestaurant.service.OrderTransitions;
import co.tz.ourrestaurant.service.PaymentPricing;
import org.junit.jupiter.api.Test;

class RestaurantApiApplicationTests {

	@Test
	void mobileMoneyFeesMatchCurrentCheckoutRules() {
		assertThat(PaymentPricing.transactionFee("Vodacom M-Pesa", 20_000)).isEqualTo(400);
		assertThat(PaymentPricing.transactionFee("Vodacom M-Pesa", 20_001)).isEqualTo(600);
		assertThat(PaymentPricing.transactionFee("TigoPesa", 20_001)).isEqualTo(550);
		assertThat(PaymentPricing.transactionFee("Visa/Mastercard", 10_000)).isEqualTo(150);
	}

	@Test
	void deliveryStatusTransitionsRejectSkippingRequiredStages() {
		assertThat(OrderTransitions.canTransition(OrderStatus.ASSIGNED, OrderStatus.IN_PREPARATION)).isTrue();
		assertThat(OrderTransitions.canTransition(OrderStatus.ASSIGNED, OrderStatus.OUT_FOR_DELIVERY)).isTrue();
		assertThat(OrderTransitions.canTransition(OrderStatus.IN_PREPARATION, OrderStatus.DELIVERED)).isFalse();
		assertThat(OrderTransitions.canTransition(OrderStatus.DELIVERED, OrderStatus.OUT_FOR_DELIVERY)).isFalse();
	}

}
