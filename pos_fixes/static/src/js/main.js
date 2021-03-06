openerp.pos_fixes = function(instance, local) {
	var QWeb = instance.web.qweb;
	var _t = instance.web._t;
	function pad (str, max) {
		str = str.toString();
		return str.length < max ? pad("0" + str, max) : str;
	}

	instance.point_of_sale.PaymentScreenWidget.include({
		update_payment_summary: function(){
			self2 = this;
			if(!self2.refreshPaymentLine){
				self2.refreshPaymentLine = setInterval(function(){
					
					var thisInterval = this;
					var currentOrder = self2.pos.get('selectedOrder');
					var paidTotal = currentOrder.getPaidTotal();
					var dueTotal = currentOrder.getTotalTaxIncluded();
					var remaining = dueTotal > paidTotal ? dueTotal - paidTotal : 0;
					var change = paidTotal > dueTotal ? paidTotal - dueTotal : 0;

					$("[class*='paymentline-input']").each(function(index, element){
						if ($(this).val() > (dueTotal * 100)){
							$(this).val(0);
						}
					});

					self2.$('.payment-due-total').html(self.format_currency(dueTotal));
					self2.$('.payment-paid-total').html(self.format_currency(paidTotal));
					self2.$('.payment-remaining').html(self.format_currency(remaining));
					self2.$('.payment-change').html(self.format_currency(change));
					if(currentOrder.selected_orderline === undefined){ remaining = 1;  }
					$("li.button:nth-child(2)").on("click",function(){
						clearInterval(thisInterval);
					});
				} ,15);
			}

			if(self2.pos_widget.action_bar){
				self2.pos_widget.action_bar.set_button_disabled('validation', !self2.is_paid());
				self2.pos_widget.action_bar.set_button_disabled('invoice', !self2.is_paid());
			}

		}
	});
};
