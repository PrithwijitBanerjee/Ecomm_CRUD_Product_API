E-Products  API end points  Create Task:
-----------------------------------------
1. Get all Products : (Private API Admin User as well as Regular User)
URL :http://localhost:3000/api/v1/products/list
REQUEST : GET
PARAMS :None
REQUESTED BODY: None

2. Get particular Product depends on id: (Private API Admin User as well as Regular User)
URL : http://localhost:3000/api/v1/products/list/:id
REQUEST:GET
PARAMS:None
REQUESTED BODY: None

3. Get Product with price limit: (Private API Admin User as well as Regular User)
URL :http://localhost:3000/api/v1/products/limit/:lim1/:lim2
REQUEST:GET
PARAMS:lim1,lim2
REQUESTED BODY: None

4. Add New  product : (Private API Only Admin User)
URL :http://localhost:3000/api/v1/products/add
REQUEST : POST
PARAMS : None
REQUESTED BODY: pro_name, pro_desc, pro_price,pro_image

5. Update Particular Product depends on ID : (Private API Only Admin User)
URL :http://localhost:3000/api/v1/products/update/:id
REQUEST : PUT/PATCH
PARAMS : id
REQUESTED BODY: pro_name, pro_desc, pro_price,pro_image

6. Delete Particular Product depends on ID :  (Private API Only Admin User)
URL :  URL :http://localhost:3000/api/v1/products/del/:id
REQUEST :DELETE
PARAMS :id
REQUESTED BODY: None

7. Get Products Based on User Search Query Keywords : (Public API)
URL :http://localhost:3000/api/v1/products/list/search?keywords
REQUEST : GET
PARAMS :None
REQUESTED BODY: None
QUERY STRING: Keywords

==========================================================
==========================================================

User :
-----------
1.Get all users (Private API Only Admin User)
URL :  URL :http://localhost:3000/api/v1/users/list
REQUEST :GET
PARAMS :None

2.Add new User (User Sign Up) (Public API)
URL :  URL :http://localhost:3000/api/v1/users/signUp
REQUEST :POST
PARAMS :None 
REQUESTED BODY: name, email, phoneNo, age, password, security_answer

2. User Sign In (Public API)
URL :  URL :http://localhost:3000/api/v1/users/signIn
REQUEST :POST
PARAMS :None 
REQUESTED BODY: email, password

3.Update User (Private API Admin User)
URL :  URL :http://localhost:3000/api/v1/users/edit/:id
REQUEST :PUT or, PATCH
PARAMS :id 
REQUESTED BODY: name, email, phoneNo, age

4.Delete User  (Private API Admin User)
URL :  URL :http://localhost:3000/api/v1/users/del/:id
REQUEST :PUT or, PATCH
PARAMS :id 
REQUESTED BODY: None

============================================================
============================================================

Order :
-----------------
1. Placed order : (Private API Admin User as well as Regular User)
URL :http://localhost:3000/products/order/buy/:pro_id/:user_id   
REQUEST : POST
PARAMS :pro_id ,user_id
REQUESTED BODY: None

2. View Order Details : (Private API Admin User as well as Regular User)
URL : http://localhost:3000/products/order/view/:order_id
REQUEST :GET
PARAMS :order_id
REQUESTED BODY: None

   orderInfo ={
   order_id:123,
   product_id:1000123,
   user_id:1001
 
  }

3. View All Orders Details:  (Private API Admin User)
URL : http://localhost:3000/products/order/view
REQUEST :GET
PARAMS :None
REQUESTED BODY: None

4. Cancel Order by order id: (Private API Admin User as well as Regular User)
URL : http://localhost:3000/products/order/cancel/:order_id
REQUEST :DELETE
PARAMS :order_id
REQUESTED BODY: None