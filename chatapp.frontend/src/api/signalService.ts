import * as signalR from "@microsoft/signalr";

let connection: signalR.HubConnection | null = null;

export const startConnection = async (token: string) => {
  connection = new signalR.HubConnectionBuilder()
    .withUrl("http://localhost:8080/chat", {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build();

  try {
    await connection.start();
    console.log("SignalR Connected.");
  } catch (err) {
    console.log("Error while establishing connection :(", err);
  }
  return connection;
};

export const getConnection = () => connection;
