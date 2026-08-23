const tarefas = [
    {titulo: "Estudar react", concluida: true, prioridade: "Alta"},
    {titulo: "Treinar", concluida: false, prioridade: "Alta"},
    {titulo: "Ler", concluida: true, prioridade: "Média"},
    {titulo: "Orar", concluida: false, prioridade: "Alta"}
];


const pendentes = tarefas.filter((tarefa) => tarefa.concluida === false);


const listaFormatada = pendentes.map((pendente) => {
    const {titulo, concluida, prioridade} = pendente;
    const finished = concluida ? "x" : " ";
    return `[${finished}] ${titulo} (prioridade : ${prioridade})`;
})

const encontradas = pendentes.find((pendentes) => pendentes.prioridade === "Alta");

const tarefaOriginal = encontradas;
const tarefaConcluida = { ...tarefaOriginal, concluida:true}


console.log(tarefaConcluida);

const {prioridade, ...resto} = tarefaConcluida;

console.log(resto);