# Info on backend functions for Trippin'

Import the './utils/backendView' file to use the functions.


## Contents

- [**Authorisation functions**](#authorisation-functions)  
Functions for signing the users in and out, accessing firebases auth feature.
    - [createUser](#createuser)  
    - [userLogIn](#userlogin)
    - [userLogOut](#userlogout)
    - [deleteAccount](#deleteaccount)
    - [userCheck](#usercheck)

- [**User functions**](#user-functions)  
Functions for accessing the /users collection in firestore.
    - [allUsers](#allusers)
    - [getUserInfo](#getuserinfo)
    - [editUserInfo](#edituserinfo)

- [**Holiday functions**](#holiday-functions)  
Functions for accessing the /:user/holidays collection in firestore. The holidays associated with the specified userId (from the users firestore collection, not the users from the authorisation).
    - [holidaysByUser](#holidaysbyuser)
    - [holidayById](#holidaybyid)
    - [addHoliday](#addholiday)
    - [editHoliday](#editholiday)
    - [removeHoliday](#removeholiday)

- [**Memory functions**](#memory-functions) 
Functions for accesing the /:user/:holiday/memory collection in firestore. 
   - [memoriesByHoliday](#memoriesbyholiday)
   - [memoryById](#memorybyid)
   - [addMemory](#addmemory)
   - [editMemory](#editmemory)
   - [removeMemory](#removememory)

- [**Share link functions**](#share-link-functions)  
Functions for creating and view a shared holiday link which doesn't require user.
   - [addLinkToHoliday](#addlinktoholiday)
   - [removeLinkFromHoliday](#removelinkfromholiday)
   - [useLinkToHoliday](#uselinktoholiday)

---
---

## Authorisation functions

### createUser

Creates a new user in the firebase auth and log in the new user in. Alos creates a new user document in the user collection in firestore.  
Requires three arguments, the users email, the password they have created and their new username. The password must be at least 6 characters and the username must be unique.

    `await createUser(email, pass, username)`

---  

### userLogIn

Logs user in. Requires email and password arguments.

    `await userLogIn(email, pass)`

--- 

### userLogOut

Logs currently logged user out, takes no arguments.

    `await userLogOut()`

--- 

### deleteAccount

Deletes currently signed in users account. Takes no arguents. Firebase with give an error and not delete the account if the user has been signed in for a while.

    `await deleteAccount()`

--- 

### userCheck

Finds the currently signed in user (if there is one) and returns the user (firebase auth) data as an object, the username will be on the object as a key of 'displayName'.

    await userCheck().then((res) => console.log(res.displayName))  
    // logs current users username.

This function can also return a boolean, true if there is a user signed in. To use this call the function with an argument of 'bool'.

    await userCheck('bool').then((res) => console.log(res))  
    // logs true or false.

---
- [contents](#contents)
---

## User functions

### allUsers

Gets all users. Needs no argument.

### getUserInfo

Gets a document from the users collection by the 'username' this is the same as the 'displayName' from the firebase/auth user. You can use the userCheck function to get the display name which you need to call this function.

    const userData = await getUserInfo(username)  
    // userData is an object with the keys/values from the firebase doc.

All users will have 'id', 'username', and 'email' fields. 'avatar' and 'bio' fields can be added so some user will have those also.

### editUserInfo

Edits the user document from the users collection. Requires three arguments. First, the userId of the user that is being changed (this is the id of the firestore user collection document). Second, the field which is being edited (valid fields are 'avatar', 'bio' and 'username')

    await editUserInfo(userId, field, input)

---
- [contents](#contents)
---

## Holiday functions

### holidaysByUser

Gets an array of all the holidays that the specified user has in the /:user/holidays subcollection. Ordered by most recent first. Each holiday in the array will be an object with keys; 'id', 'title', 'startDate' and 'locationData'. Some holidays will also have keys of 'info' and 'shareLink'.

    await holidaysByUser(userId)

### holidayById

Gets a single holiday. Requires arguments with the userId and holidayId. Will return an object with the key/values in the document.

    await holidayById(userId, holidayId)

### addHoliday

Posts a new holiday to the holiday collection associated with the specified user. Will also return the new holiday as an object. Requires userId, title and location arguments. The title argument needs to be a unique holiday title for the specified user. The location should be input in the format `{ latitude: 39.9042, longitude: 116.4074 }` latitude and longitue values must be numbers, can be minus numbers.

    await addHoliday(userId, title, location)

### editHoliday

Edits specified field in a holiday document. Takes four arguments; userId, holidayId, field and input. valid fields are; 'title', 'locationData', 'startDate' and 'info'.  
The location should be input in the format `{ latitude: 39.9042, longitude: 116.4074 }` latitude and longitue values must be numbers, can be minus numbers.  
The title must be unique for the specified users holiday collection.  
This will also return an object with the details of the updated holiday.

    await editHoliday(userId, holidayId, field, input)

### removeHoliday

Deletes the the holiday the user no longer requires. Takes two arguments, userId and holidayId. 

    await removeHoliday(userId, holidayId)

---
- [contents](#contents)
---

## Memory functions

### memoriesByHoliday

Gets an array of all the memories that the specified user has in the specified holiday collection in the /:user/:holiday/memories subcollection. Ordered by most recent first. Each Memory in the array will be an object with keys; 'id', 'title', 'date' and 'locationData'. Some Memories will also have a key of 'note'.

    await memoriesByHoliday(userId, holidayId)

### memoryById

Gets a single memory. Requires three arguments; userId, holidayId and memoryId. Will return an object with the key/values in the document.

    await memoryById(userId, holidayId, memoryId)

### addMemory

Posts a new memory to the memory collection associated with the specified user and holiday sub-collection. Will also return the new memory as an object. Requires userId, holidayId, title and location arguments. The title argument needs to be a unique memory title for the specified holiday. The location should be input in the format `{ latitude: 39.9042, longitude: 116.4074 }` latitude and longitue values must be numbers, can be minus numbers.

    await addMemory(userId, holidayId, title, location)


### editMemory

Edits single specific field in a memory document. Takes five arguments; userId, holidayId, memoryId, field and input. valid fields are; 'title', 'locationData', 'date' and 'note'.  
The location should be input in the format `{ latitude: 39.9042, longitude: 116.4074 }` latitude and longitue values must be numbers, can be minus numbers.  
The title must be unique for the specified holidays, memories collection.  
This will also return an object with the details of the updated memory.

    await editMemory(userId, holidayId, memoryId, field, input)

### removeMemory

Deletes memory. Three arguments; userId, holidayId and memoryId.

    await removeMemory(userId, holidayId, memoryId)

---
- [contents](#contents)
---

## Share link functions

### addLinkToHoliday

Adds a 'shareLink' field to a specified holiday with a random code. Should return an object with the details of the updated holiday. Takes two arguments; userId and holidayId.

    await addLinkToHoliday(userId, holidayId)

This will check if the shareLink already exists and will only create one if there is no existing link.

### removeLinkFromHoliday

Deletes the shareLink from a holiday document (changes the shareLink to an empty string). Requires two arguments; userId and holidayId.

    await removeLinkFromHoliday(userId, holidayId)

### useLinkToHoliday

Returns the holiday object associated with the link. Doesnt require a userId. Only the shareLink of the holiday is required.

    await useLinkToHoliday(link)

---
- [contents](#contents)
---