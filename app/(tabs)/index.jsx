import TaskItem from '@/components/TaskItem';
import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [tarefas, setTarefas] = useState([]);
  const [novoTitulo, setNovoTitulo] = useState("");
  const [mostrarConcluidas, setMostrarConcluidas] = useState(false);
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState("Média");
  const [carregando, setCarregando] = useState(true);
  const pendentes = tarefas.filter((tarefa) => tarefa.concluida === false);
  const concluidas = tarefas.filter((tarefa) => tarefa.concluida === true);
  

  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const dadosSalvos = await AsyncStorage.getItem('@tarefas');
        if (dadosSalvos !== null){
          setTarefas(JSON.parse(dadosSalvos));
        }
      } catch (erro){
        console.log("Erro ao carregar", erro);
      } finally {
        setCarregando(false); //garante que esse useEffect rode primeiro 
      }
    };
    carregarTarefas();
  }, []); //na abertura carrega os dados salvos

  useEffect(() =>{
    if (carregando) return;
    const salvarTarefas = async () => {
      try {
        await AsyncStorage.setItem('@tarefas', JSON.stringify(tarefas));
      } catch (erro) {
        console.log("Erro ao salvar:", erro);
      } 
    };

    salvarTarefas();
  }, [tarefas, carregando]); //sempre que as tarefas mudarem salva com asyncStorage

  const adicionarTarefa = () => {
    if (novoTitulo !== ""){
      const novaTarefa = {
        id: Date.now(),
        titulo : novoTitulo,
        concluida : false,
        prioridade : prioridadeSelecionada
      };

      setTarefas([...tarefas, novaTarefa]);
      setNovoTitulo("");
      setPrioridadeSelecionada("Média");
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

  const pesoPrioridade = {Alta: 3, Média: 2, Baixa: 1};
  pendentes.sort(  //organizar as pendentes por prioridade
    (a,b) => pesoPrioridade[b.prioridade] - pesoPrioridade[a.prioridade]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas Pendentes: {pendentes.length}</Text>

      <View style={styles.prioridadeContainer}>
        {["Alta", "Média", "Baixa"].map((nivel) => ( //cria 3 botoes com o map
          <Pressable
           key={nivel} 
           style={[ styles.prioridadeBotao, prioridadeSelecionada === nivel && 
                  styles.prioridadeBotaoAtivo ]}
           onPress={() => setPrioridadeSelecionada(nivel)}
           >
            <Text>{nivel}</Text>
           </Pressable>
        ))}

      </View>


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
      {pendentes.length === 0 && (
        <Text style={styles.vazio}>Nenhuma tarefa pendente🎉</Text>
      )}

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
  },
  prioridadeContainer: {
    flexDirection: 'row',
    gap: 10,
    paddingLeft: 10,
  },
  prioridadeBotao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 4,
  },
  prioridadeBotaoAtivo: {
    backgroundColor: '#b4ddce'
  },
  vazio: {
  textAlign: 'center',
  color: '#6B7280',
  marginTop: 10,
  },
});

