import net from "node:net";

const host = process.env.REDIS_HOST || "localhost";
const port = Number.parseInt(process.env.REDIS_PORT || "6379", 10);
const password = process.env.REDIS_PASSWORD;

const encodeCommand = (...parts: string[]) => {
  return `*${parts.length}\r\n${parts
    .map((part) => `$${Buffer.byteLength(part)}\r\n${part}`)
    .join("\r\n")}\r\n`;
};

const socket = net.createConnection({ host, port });

const fail = () => {
  socket.destroy();
  process.exit(1);
};

socket.setTimeout(3000, fail);

socket.on("connect", () => {
  if (password) {
    socket.write(encodeCommand("AUTH", password));
    return;
  }

  socket.write(encodeCommand("PING"));
});

socket.on("data", (data) => {
  const response = data.toString();

  if (response.includes("+OK")) {
    socket.write(encodeCommand("PING"));
    return;
  }

  if (response.includes("+PONG")) {
    socket.end();
    process.exit(0);
  }

  fail();
});

socket.on("error", fail);
