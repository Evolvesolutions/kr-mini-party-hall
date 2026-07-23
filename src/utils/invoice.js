export const generateInvoicePDF = (booking, hall, options = {}) => {
  const dateStr = new Date(booking.event_date || booking.created_at).toLocaleDateString();
  const bookingId = booking.id || booking._id || 'booking';
  const invoiceNo = `INV-${bookingId.slice(-8).toUpperCase()}`;
  const hallPrice = booking.price || hall?.price || 0;
  const couponDiscount = booking.discount_amount || 0;
  const advancePaid = typeof booking.amount_paid === 'number'
    ? booking.amount_paid
    : typeof booking.price === 'number'
      ? booking.price - couponDiscount
      : hallPrice - couponDiscount || 3000;
  const balanceDue = hallPrice - advancePaid;

  const htmlContent = `
    <html>
      <head>
        <title>Invoice - ${invoiceNo}</title>
        <style>
          body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; color: #333; margin: 40px; }
          .header { display: flex; justify-content: space-between; border-bottom: 2px solid #D4AF37; padding-bottom: 20px; }
          .logo { font-size: 24px; font-weight: bold; color: #1a0533; }
          .invoice-title { font-size: 28px; color: #D4AF37; text-align: right; }
          .details { margin-top: 30px; display: flex; justify-content: space-between; }
          .details-block { width: 45%; }
          .details-block h3 { border-bottom: 1px solid #ddd; padding-bottom: 5px; margin-bottom: 10px; color: #555; }
          .details-block p { margin: 5px 0; font-size: 14px; }
          table { width: 100%; border-collapse: collapse; margin-top: 40px; }
          th { background: #f9f9f9; border-bottom: 2px solid #ddd; padding: 12px; text-align: left; font-size: 14px; }
          td { border-bottom: 1px solid #eee; padding: 12px; font-size: 14px; }
          .totals { margin-top: 30px; text-align: right; font-size: 14px; }
          .totals table { width: 300px; margin-left: auto; }
          .totals table td { border: none; padding: 6px 12px; }
          .totals .grand-total { font-size: 18px; font-weight: bold; color: #D4AF37; border-top: 1px solid #ddd; }
          .footer { margin-top: 60px; text-align: center; font-size: 12px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
          @media print {
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="logo">KR Mini Party Hall</div>
            <p style="margin: 5px 0; font-size: 14px;">1, Kakkan Street, First Main Rd,<br/>Pozhichalur, Chennai, Tamil Nadu 600075</p>
            <p style="margin: 5px 0; font-size: 14px;">Contact: +91 7550120574</p>
          </div>
          <div>
            <div class="invoice-title">INVOICE</div>
            <p style="margin: 5px 0; font-size: 14px; text-align: right;"><b>Invoice No:</b> ${invoiceNo}</p>
            <p style="margin: 5px 0; font-size: 14px; text-align: right;"><b>Date:</b> ${new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div class="details">
          <div class="details-block">
            <h3>Billed To</h3>
            <p><b>Name:</b> ${booking.customer_name}</p>
            <p><b>Email:</b> ${booking.customer_email || 'N/A'}</p>
            <p><b>Phone:</b> ${booking.customer_phone}</p>
            <p><b>Address:</b> ${booking.customer_address || 'N/A'}</p>
          </div>
          <div class="details-block">
            <h3>Booking Details</h3>
            <p><b>Event Type:</b> ${booking.event_type}</p>
            <p><b>Event Date:</b> ${dateStr}</p>
            <p><b>Time Slot:</b> ${booking.time_slot || 'N/A'}</p>
            <p><b>Guests:</b> ~${booking.guest_count || 0}</p>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th style="text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <b>Hall Booking - ${hall?.name || 'Grand Kalyana'}</b><br/>
                <span style="font-size: 12px; color: #666;">Booking reservation for ${dateStr} (${booking.time_slot || 'N/A'})</span>
              </td>
              <td style="text-align: right;">₹${hallPrice.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals">
          <table>
            <tr>
              <td><b>Total Rental:</b></td>
              <td style="text-align: right;">₹${hallPrice.toLocaleString('en-IN')}</td>
            </tr>
            ${couponDiscount > 0 ? `
            <tr style="color: #2e7d32;">
              <td><b>Coupon Discount (${booking.coupon_code || 'Coupon'})</b></td>
              <td style="text-align: right;">-₹${couponDiscount.toLocaleString('en-IN')}</td>
            </tr>
            ` : ''}
            <tr style="color: #2e7d32;">
              <td><b>Advance Paid (Online):</b></td>
              <td style="text-align: right;">₹${advancePaid.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="grand-total">
              <td><b>Balance Due (At Venue):</b></td>
              <td style="text-align: right;">₹${balanceDue.toLocaleString('en-IN')}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          <p>Thank you for choosing KR Mini Party Hall!</p>
          <p>This is a computer-generated invoice and does not require a physical signature.</p>
          <button class="no-print" onclick="window.print();" style="margin-top: 15px; background: #D4AF37; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 5px; cursor: pointer;">Print Invoice</button>
        </div>

        <script>
          window.onload = function() {
            if (${autoPrint}) {
              setTimeout(function() {
                window.print();
              }, 500);
            }
          };
        </script>
      </body>
    </html>
  `;

  const blob = new Blob([htmlContent], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${invoiceNo}.html`;
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);

  setTimeout(() => URL.revokeObjectURL(url), 1000);
};
