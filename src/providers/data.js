import jsonServerProvider from "ra-data-json-server";
import { server_ip, server_port } from "./attrs";

export default jsonServerProvider(server_ip + ":" + server_port);
