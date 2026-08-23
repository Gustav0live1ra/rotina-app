export const formatarTarefa = (tarefa) =>{
    const {titulo, concluida, prioridade} = tarefa;
    const x = concluida ? "x":" "; 
    return `[${x}] ${titulo} (prioridade: ${prioridade})`;
}
