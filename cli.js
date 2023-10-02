#!/usr/bin/env node

import inquirer from "inquirer";
import io from "socket.io-client";
import ora from "ora";
import chalk from "chalk";
import prompt from "prompt";

prompt.message = "";
prompt.delimiter = "";

const backendURL = "http://localhost:5000";

const getMessageInput = ({socket, username, connectedTo}) => {
  prompt.get(["You:"], function (err, result) {
    const messageText = result["You:"];

    socket.emit("chatic_send-message", {
      user1: username,
      user2: connectedTo,
      sender: username,
      message: messageText,
    });
  });
}

(() => {
  const socket = io(backendURL);
  inquirer
    .prompt([
      {
        type: "input",
        name: "username",
        message: "Enter your username: ",
      },
    ])
    .then((result) => {
      const username = result?.username;
      socket.emit("chatic_add-user", username);
      const spinner = ora("Connecting you to our servers!").start();
      socket.on("chatic_user-added", (data) => {
        if (data?.status) {
          setTimeout(() => {
            spinner.stop();
            const { user1, user2 } = data?.room;

            const connectedTo =
              user1?.username === username ? user2?.username : user1?.username;
            console.log("\n");
            console.log(`Connected to: ${chalk.blueBright(connectedTo)}`);
            console.log("\n");

            socket.on("chatic_message-received", (data) => {
              const { message, sender } = data;

              if (sender !== username) {
                console.log("\n", message);
              }
            });

             getMessageInput({
              socket, 
              connectedTo,
              username, 
             });
          }, 2000);
        } else {
          console.log("\n", chalk.redBright(data?.message));
        }
      });
    });
})();
