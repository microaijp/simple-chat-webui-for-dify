![simple-chat-webui-for-dify](public/readme/sample.png)
This project is a very simple web UI made with Next.js for Dify.
It is responsive and supports smartphones.

I am currently learning programming, so please don't expect too much :P

## Getting Started

### Setting up the .env file
Please configure at least the following two items, referring to the screenshot:

```
DIFY_APP_API_BASE_URL=https://xxxxx.xxxx.xxx/v1
DIFY_APP_API_KEY=app-XXXXXXXXXXXXXX
```
![api_screen_shot](public/readme/api.png)

### Running locally
You can start it in two steps:
```
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to check.

## Customization
You can customize it with the .env file.
![customize](public/readme/customize.png)

## BASIC Authentication
```
# If authentication is required, set it to "BASIC"; otherwise, leave it empty.
AUTH_MODE="BASIC"
# If you want to set multiple users, use the following format:
BASIC_AUTH_USERS='{"user1":"pass1","user2":"pass2","admin":"adminpass"}'
```
By setting `AUTH_MODE` to `BASIC`, you can enable BASIC authentication with multiple users support.
If authentication is not needed, leave `AUTH_MODE` empty.

## Change log

### v0.0.7
Multiple user support and Ctrl+Enter keyboard shortcut added.
- **Multiple User Support**: Each user is now properly identified and tracked through the `/api/auth/user` endpoint
- **Ctrl+Enter Shortcut**: Users can now send messages using Ctrl+Enter keyboard combination for faster chat interaction
- **User Tracking**: Improved user session management with fallback UUID generation

### v0.0.6
Fixed library compatibility errors

### v0.0.5
Upgraded to the latest version of Next.js 15.4.2.
Additionally, fixed bugs that occurred due to this upgrade.

### v0.0.4
![0.0.4](public/readme/0.0.4-1.png)
Maintenance functionality has been implemented.  
If there is no connection to the Didify server, it will automatically switch to the maintenance screen.  
The text to be displayed is  
.env `NEXT_PUBLIC_MAINTENANCE_TITLE` `NEXT_PUBLIC_MAINTENANCE_BODY`.

### v0.0.3
Google Tag Mnagager is now supported.
Specify the ID of Google tag manager for GTMID.
If not used, specify empty.

Example: `GTM-KZR8CDNR`

.env
```
###### GoogleTagManager
GTMID=
```

### v0.0.2
The OPENING QUESTIONS function is now supported.

![customize](public/readme/OPENING_QUESTIONS.png)

## Deploy on Vercel
Since Server-Sent Events are used, it also works on Vercel.
However, in the free plan, the chat may be interrupted due to time limitations.

## Heartfelt Thanks to the Dify Development Team
Thank you very much for developing such a wonderful application.
I sincerely appreciate it.