const tarefa = {titulo: "Estudar react", concluida: true, prioridade: "Alta"};

const {titulo, concluida} = tarefa;

const formatarTarefa = (tarefa) => {
    const {titulo, concluida, prioridade} = tarefa;
    const finished = concluida ? "x" : " "
    return `[${finished}] ${titulo} (prioridade : ${prioridade})`;
}


const valor = formatarTarefa(tarefa);
console.log(valor);