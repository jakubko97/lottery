VueJS project deployment

1. Build project
```
npm run build
```

2. Secure copy folder from mac to raspberry pi

```
scp -r dist/* pi@192.168.1.108:../../var/www/html
```
scp -r <FOLDER_TO_COPY> pi@<IP_ADDRESS>:<DESTINATION_FOLDER>
