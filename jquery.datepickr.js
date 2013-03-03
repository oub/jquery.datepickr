(function($) {

	"use strict";

	var months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
	    //monthsShort = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sept', 'Oct', 'Nov', 'Déc'],
	    days = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

	/*
	function WN(y, m, d) {
		return wn(new Date(y, m - 1, d));
	}

	function wn(date) {
		var y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
		var ms1d = 86400000, ms7d = 7 * ms1d;
		var DC3 = Date.UTC(y, m - 1, d + 3) / ms1d;
		var AWN = Math.floor(DC3 / 7);
		var Wyr = (new Date(AWN * ms7d)).getUTCFullYear();
		return AWN - Math.floor(Date.UTC(Wyr, 0, 7) / ms7d) + 1;
	}*/

	var htmlCalendar = function (y, m) {
		y = y || new Date().getFullYear();
		m = m || new Date().getMonth() + 1;
		var date = new Date(y, m - 1, 1),
		    prevMonth = new Date(y, m - 2, 1),
		    nextMonth = new Date(y, m, 1),
		    today = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
		    todayMonth = today.getMonth(),
		    todayDate = today.getDate(),
		    firstWeekDay = date.getDay() === 0 ? 7 : date.getDay(),
		    monthNumber = date.getMonth(),
		    s = '';
		s = '<div class="ui-datepickr-month">';
		s += '<div class="ui-datepickr-month-header">';
		s += '<a class="ui-datepickr-change-month ui-datepickr-next-month" data-month="' + nextMonth.getFullYear() + '-' + (nextMonth.getMonth() + 1) + '">❯</a>';
		s += '<a class="ui-datepickr-change-month ui-datepickr-prev-month" data-month="' + prevMonth.getFullYear() + '-' + (prevMonth.getMonth() + 1) + '">❮</a>';
		s += months[date.getMonth()] + ' ' + date.getFullYear();
		s += '</div>';
		s += '<div class="ui-datepickr-week-days">';
		//s += '<small class="ui-datepickr-week-number"></small>';
		s += '<span class="ui-datepickr-day-of-week">' + days.join('</span><span class="ui-datepickr-day ui-datepickr-day-of-week">').toLowerCase() + '</span></div>';
		date.setHours((1 - firstWeekDay) * 24);
		for (var week = 0; week < 6; week++) {
			s += '<div class="ui-datepickr-week">';
			//s += '<small class="ui-datepickr-week-number">' + WN(date.getFullYear(), date.getMonth() + 1, date.getDate()) + '</small>';
			for (var day = 0; day < 7; day++) {
				s += '<a class="ui-datepickr-day ';
				s += day === 6 ? 'ui-datepickr-sunday ' : '';
				s += monthNumber === date.getMonth() ? 'ui-datepickr-day-of-month' : 'ui-datepickr-out-of-month';
				s += todayMonth === date.getMonth() && todayDate === date.getDate() ? ' ui-datepickr-today' : '';
				s += today > date ? ' ui-datepickr-past' : '';
				s += '"';
				s += monthNumber === date.getMonth() ? ' id="d' + date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2) + '"' : '';
				s += '>' + date.getDate() + '</a>';
				date.setHours(24);
			}
			//date.setHours(24);
			s += '</div>';
			if (date.getMonth() !== monthNumber) {
				break;
			}
		}
		s += '</div>';
		return s;
	};

	$.fn.datepickr = function() {

		return this
		.addClass('has-datepickr')
		.attr('autocomplete', 'off')
		.on('focus.datepickr', function () {
			if ($(this).data('datepickr')) {
				return;
			}
			var $dateField = $(this),
			    date = $dateField.val().split('/'),
			    offset = $dateField.offset(),
			    parentOffset = $dateField.offsetParent().offset(),
				top = offset.top - parentOffset.top + $dateField.outerHeight() - 1 + 9,
			    $calendar = $('<div class="ui-datepickr blue" style="top:' + top + 'px; left:' + 0 + 'px;">' + htmlCalendar(date[2], date[1]) + '</div>');

			$dateField
				.after($calendar)
				.data('datepickr', $calendar)
				.addClass('datepickr-opened');
			$calendar.css('left', offset.left - parentOffset.left - ($calendar.outerWidth() / 2) + ($dateField.outerWidth() / 2));

			// Pick a date
			$calendar.on('click.datepickr.pick-a-date', '.ui-datepickr-day-of-month', function () {

				// Update the field
				$dateField.val($(this).attr('id').substr(1).split('-').reverse().join('/'));

				// Close the datepickr
				$dateField.trigger('close-datepickr');
			});

			// Change the month
			$calendar.on('click.datepickr.change-month', '.ui-datepickr-change-month', function () {

				// Get the month to display
				var param = $(this).data('month').split('-');

				// Refresh the date picker
				$calendar.html(htmlCalendar(param[0], param[1]));

				// Highlight the selected day
				$('#d' + $dateField.val().split('/').reverse().join('-')).addClass('s');
			});

			//$calendar.on('click', function () {
			//	$dateField.trigger('close-datepickr');
			//});

			// Highlight the selected day
			$('#d' + $dateField.val().split('/').reverse().join('-')).addClass('s');

			// Prevent closing the datepickr
			$dateField.add($calendar).on('click.datepickr focusin.datepickr', function () {
				return false;
			});

			// Add an event handler to body to close the datepickr
			$('html').on('click.datepickr focusin.datepickr', function () {

				// Close the datepickr
				$dateField.trigger('close-datepickr');
			});

		}).on('close-datepickr', function () {

			// Remove the datepickr close handler
			$(this).add('html').off('click.datepickr focusin.datepickr');

			// Remove the popup calendar
			$(this).data('datepickr').remove();

			// Restore the field state
			$(this).data('datepickr', null).removeClass('datepickr-opened');
		});

		return this;
	};


} (jQuery));


$(function () {

	$('[name=date]').datepickr().focus();

});