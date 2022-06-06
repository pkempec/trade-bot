# trade-bot stats
Web app that displays statistics generaged by trade-bot.

## TODO 
- Render week - select some logs from each day instead of all
- Render moth - select some logs from each day instaed of all
! note all buy/sell must presents

## start

```
yarn start
```

## Linux

To Resolve 

```
FATAL ERROR: CALL_AND_RETRY_LAST Allocation failed - JavaScript heap out of memory error Command failed with exit code 1.
```

add to /etc/environment

```
NODE_OPTIONS="--max-old-space-size=2048"
```