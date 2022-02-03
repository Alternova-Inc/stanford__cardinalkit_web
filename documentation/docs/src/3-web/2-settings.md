---
home: false
title: web administration
footer: Alternova Inc
---
<Block>

## 1) Create admin account

 <br />

 To manage your website you need to create an administrator account this is created from the firebase administrator

 From the firebase administrator enter authentication

 <br />

 <img src="./images/authentication.png" alt="drawing" width="550"/>

 <br />
 <br />

 and then add new user
 
 <br />

 <img src="./images/newuser.png" alt="drawing" width="850"/>

 <br />
 <br />

enter a username and password for the administrator user

<br />

<img src="./images/userpassword.png" alt="drawing" width="750"/>

<br />
<br />

Now you need to indicate to the web page that this new user is an administrator user, the user roles are managed from the database in firestore
For users created from the web, this process will be automatic, it is necessary to do it by hand only once for the administrator user.

First copy the uid of the user you just created

<br />

<img src="./images/useruid.png" alt="drawing" width="750"/>

<br />
<br />

then click on firestore database

<br />

<img src="./images/Firestore.png" alt="drawing" width="250"/>

<br />
<br />

Esta es la base de datos de todo el proyecto aca podras ver todos los registros de estudios y usuarios generados en la aplicacion.

Crea una nueva coleccion llamada user_roles,
agrega un docuemento con el uid del usuario previamente creado


Finalmente agrega un campo al documento rol:"superAdmin"

<br />

<img src="./images/add_role.png" alt="drawing" width="850"/>

<br />
<br />

Now you can log in with your administrator account

</Block>