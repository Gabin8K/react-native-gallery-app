**

## React Native Gallery App + Supabase⚡️

![App Screenshot](https://ctzjgtlftzqiaqluuiuo.supabase.co/storage/v1/object/sign/app-images/gallery-app.png?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1cmwiOiJhcHAtaW1hZ2VzL2dhbGxlcnktYXBwLnBuZyIsImlhdCI6MTcxMzgzODY2MCwiZXhwIjoxNzE0MTg0MjYwfQ.s7ptnU753jKmCptiRTvzxelfdwZTD7a5WSo74ZlBHgs&t=2024-04-23T02%3A17%3A40.354Z)

**This application uses super core storage to perform CRUD operations on files uploaded from the device.* 
The objective of this application was to exploit the functionalities of Supabase, make some animations and develop components without using a UI library.*

**Functionality:**

> - Device theme support
> - Theme manager inspired by unistyle (zero library)
> - And more...

Steps to follow for starting the project:

  1. Set up a supabase account.
  2. Copy the superbase connection string in your project
  3. Create an .env file at the root of the project and add the authorization key `EXPO_PUBLIC_SUPABASE_API_KEY` and `EXPO_PUBLIC_SUPABASE_URL`
  4. Enable the storage service, create a bucket named `files` and make it public

Launch the application in Expo Go

     - cd gallery-app
      - npm i
      - npx expo start -a (Started with ios)
      - npx expo start -i (Started with android)
