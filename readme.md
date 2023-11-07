## Daycare Project with MERN stack

this applications is a personal daycare system that I did for my family,currently receives $12k in monthly payments, made managing everything that happens much easier,  no more keeping information on paper about who’s gonna come this week,  who paid, etc. now all that my parents need to do is use four buttons, check-in, check-out, late and generate registration code

clients stopped using 6 months later, they prefer to pay in person, for demonstration on: <a href='https://gomesdaycare.herokuapp.com'>www.gomesdaycare.com</a>
<li>email: admin@gmail.com</li>
<li>password: 81377662</li> 

<img width="1040" alt="dashboard" src="https://user-images.githubusercontent.com/98370540/216496234-2a92e76f-51a6-4109-901e-488f16a5ea64.png">
<img width="1440" alt="managment" src="https://user-images.githubusercontent.com/98370540/216496954-a983510d-7852-44af-8ac2-52a10569901f.png">
<img width="1440" alt="calendar" src="https://user-images.githubusercontent.com/98370540/216497400-d55858c9-3570-41a0-a9e1-ec7f00754876.png">
<img width="1440" alt="history" src="https://user-images.githubusercontent.com/98370540/216497732-aac52030-bd68-4067-b3d1-059909b1d527.png">
<img width="1440" alt="checkout" src="https://user-images.githubusercontent.com/98370540/216497445-8f1bf63e-e410-4e66-b538-2c56542a23c9.png">


## Functionality

clients are required to sign to the website so they can get charged on the daily basis.

the client can do the followings:
1. create a schedule ahead of time and pay for it.
2. see what dates the daycare won't be open (if something happens).
3. check past payments and pending balance.
4. pay for all the schedules through stripe.

the admin can do the followings:
1. check-in clients when arriving at the daycare, which creates a charge of $35 on their account, and sends them a message of confirmation.

2. check-out clients when picking up their kids, if the check-out is done anytime after 6:15 PM, $15 more will be added to their balance, and sends them a message of confirmation.

3. 10 days after the due date the client receives a text message through twillio saying that their account will be blocked in 5 days.

4. keeps track of the total balance of each user.

5. set unavailable dates so clients can see on their calendars.

6. generates the code for the registration of each user and other admins if necessary.

## How to start the Application

1. Run npm install from the root directory
2. cd into frontend and run npm install
3. from the root directory run the followings:
4. npm run server
5. npm run client
