import TaskItem from '@/components/TaskItem';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';

export default function HomeScreen() {
  const [tarefas, setTarefas] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [mostrarConcluidas, setMostrarConcluidas] = useState(false);
  const pendentes = tarefas.filter((tarefa) => tarefa.concluida === false);
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida === true);

  useEffect(() => {
    const tarefasSalvas = [
      { id: 1, titulo: "Estudar react", concluida: true, prioridade: "Alta" },
      { id: 2, titulo: "Treinar", concluida: false, prioridade: "Alta" },
      { id: 3, titulo: "Ler", concluida: false, prioridade: "Média" },
      { id: 4, titulo: "Orar", concluida: false, prioridade: "Alta" },
    ];
    setTarefas(tarefasSalvas);
  }, []); //só na abertura da tela

  const adicionarTarefa = () => {
    if (novoTitulo !== ""){
      const novaTarefa = {
        id: Date.now(),
        titulo : novoTitulo,
        concluida : false,
        prioridade : "Média"
      };

      setTarefas([...tarefas, novaTarefa]);
      setNovoTitulo("");
    }
  };

  const removerTarefa = (id) => {
    setTarefas(tarefas.filter((tarefa)=> tarefa.id !== id));
  };

  const alternarStatus = (id) =>{
    setTarefas(tarefas.map((tarefa) =>
      tarefa.id === id ? { ...tarefa, concluida : !tarefa.concluida } : tarefa
    ));
  }


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas Pendentes: {pendentes.length}</Text>
        
      <TextInput 
        style={styles.input}
        placeholder="Nova tarefa"
        value={novoTitulo}
        onChangeText={(titulo) => setNovoTitulo(titulo)}
      />
      
      <View style={styles.botoesContainer}>

        <Pressable style={styles.button} onPress={adicionarTarefa}>
          <Text>Adicionar</Text>
        </Pressable>

      </View>

      <View style={styles.lista}>
        {pendentes.map((tarefa) => (
          <TaskItem key={tarefa.id}
            {...tarefa}
            onChangeStatus = {alternarStatus}
            onRemover = {removerTarefa}
          />
        ))}
      </View>

    <View style={styles.secaoConcluidas}>
      <Pressable onPress={() => setMostrarConcluidas(!mostrarConcluidas)}>
        <Text style={styles.toggleTexto}>
          {mostrarConcluidas ? "▼" : "▶"} Concluídas ({concluidas.length})
        </Text>
      </Pressable>

      {mostrarConcluidas && ( //renderiza se mostrarConcluidas for verdadeiro
        <View style={styles.lista}>
          {concluidas.map((tarefa) => (
            <TaskItem key={tarefa.id}
              {...tarefa}
              onChangeStatus={alternarStatus}
              onRemover={removerTarefa}
            />
          ))}
        </View>
      )}
    </View>
    
    </View>
    );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  botoesContainer: {
    flexDirection:  'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,    
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  lista: {
    gap: 8, //espaço entre as tarefas
  },
  secaoConcluidas: {
    marginTop: 20,
  },
  toggleTexto: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 8,
  }
});

