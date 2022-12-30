To start the website you need to install all the packages
- Type the command "npm install" to install the package
- After installing the package, type the command "npm start" to start the website

Account used in the website

- Member account:
   + username:vigat36901@lance7.com
   + password: 123

- Admin account:
   + username:admin@admin
   + password: admin

- Warehouse staff account:
   + username: warehousestaff1@admin
   + password: 123

- Sale staff account:
   + username: storeAdmin@admin
   + password: 123

In this application we use the payment platform Stripe, and to catch the payment event between the user and Stripe we use the webhook. 
To start the webhook, type the command "stripe listen --forward-to localhost:3000/webhook"

List of vouchers in the website

	voucher code: NEWYEAR20
	discount value: 20 %	


	voucher code : NOEL10
	discount value: 10%

	

	
