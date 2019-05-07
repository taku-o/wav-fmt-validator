#!/usr/bin/env node
"use strict";
var fs = require('fs');
var wavParser = require('../validator').parser;
const args = process.argv.slice(2);
if (args.length < 1) {
    process.exit(1);
}
const wavFile = args[0];
fs.readFile(wavFile, 'binary', (err, content) => {
    if (err) {
        console.error(err);
        return;
    }
    let buffer = Buffer.from(content, 'binary');
    console.log(wavParser(buffer));
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJpbi93YXYtcGFyc2UudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFDQSxJQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDdkIsSUFBSSxTQUFTLEdBQUcsT0FBTyxDQUFDLGNBQWMsQ0FBQyxDQUFDLE1BQU0sQ0FBQztBQUcvQyxNQUFNLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNuQyxJQUFJLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0lBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7Q0FDakI7QUFDRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFHeEIsRUFBRSxDQUFDLFFBQVEsQ0FBQyxPQUFPLEVBQUUsUUFBUSxFQUFFLENBQUMsR0FBRyxFQUFFLE9BQU8sRUFBRSxFQUFFO0lBQzlDLElBQUksR0FBRyxFQUFFO1FBQ1AsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixPQUFPO0tBQ1I7SUFDRCxJQUFJLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztJQUM1QyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO0FBQ2pDLENBQUMsQ0FBQyxDQUFDIiwiZmlsZSI6ImJpbi93YXYtcGFyc2UuanMiLCJzb3VyY2VzQ29udGVudCI6WyIjIS91c3IvYmluL2VudiBub2RlXG52YXIgZnMgPSByZXF1aXJlKCdmcycpO1xudmFyIHdhdlBhcnNlciA9IHJlcXVpcmUoJy4uL3ZhbGlkYXRvcicpLnBhcnNlcjtcblxuLy8gcGFyYW1zXG5jb25zdCBhcmdzID0gcHJvY2Vzcy5hcmd2LnNsaWNlKDIpO1xuaWYgKGFyZ3MubGVuZ3RoIDwgMSkge1xuICBwcm9jZXNzLmV4aXQoMSk7XG59XG5jb25zdCB3YXZGaWxlID0gYXJnc1swXTtcblxuLy8gcGFyc2VyIGFuZCBwcmludCBvdXRcbmZzLnJlYWRGaWxlKHdhdkZpbGUsICdiaW5hcnknLCAoZXJyLCBjb250ZW50KSA9PiB7XG4gIGlmIChlcnIpIHtcbiAgICBjb25zb2xlLmVycm9yKGVycik7XG4gICAgcmV0dXJuO1xuICB9XG4gIGxldCBidWZmZXIgPSBCdWZmZXIuZnJvbShjb250ZW50LCAnYmluYXJ5Jyk7XG4gIGNvbnNvbGUubG9nKHdhdlBhcnNlcihidWZmZXIpKTtcbn0pO1xuIl19
