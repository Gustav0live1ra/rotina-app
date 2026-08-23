import { formatarTarefa } from "./utils.js";

const tarefa = { titulo: "correr", concluida: false, prioridade: "Media"};

const valor = formatarTarefa(tarefa);
console.log(valor);