import TaskItem from '@/components/TaskItem';
import { View, Text, StyleSheet, Pressable, TextInput, Modal } from 'react-native';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

//levei a secao de concluidas para rotina e preciso tirar daqui, porém as tarefas vão continuar existindo com status de concluidas
//então a gente faz um sistema de dupla verificação pra marcar como concluida, e exclui assim que o usúario confirmar

export default function HomeScreen() {
  const [tarefas, setTarefas] = useState([]);  //atualizar tarefas
  const [novoTitulo, setNovoTitulo] = useState("");  //modificar titulo
  const [prioridadeSelecionada, setPrioridadeSelecionada] = useState("Média");  //selecionar prioridade
  const [menuAbertoId, setMenuAbertoId] = useState(null);  //o menu de qual tarefa ta aberto
  const [tarefaEditandoId, setTarefaEditandoId] = useState(null); //tarefa em edicao
  const [prioridadeEditada, setPrioridadeEditada] = useState("Média");  //editar prioridade modal
  const [tituloEditado, setTituloEditado] = useState("");  //editar titulo modal
  const [carregando, setCarregando] = useState(true); 
  
  

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
  };

  const editarTarefa = (id, novoTitulo, novaPrioridade) => {
    setTarefas(tarefas.map((tarefa) => 
      tarefa.id === id ? 
      { ...tarefa, titulo: novoTitulo, prioridade: novaPrioridade }
      : tarefa
    ));
  };

  const alternarMenu = (id) => {
    setMenuAbertoId(menuAbertoId === id ? null : id);
  };

  const iniciarEdicao = (id) => {
    const tarefa = tarefas.find((t) => t.id === id);
    setTituloEditado(tarefa.titulo);
    setPrioridadeEditada(tarefa.prioridade);
    setTarefaEditandoId(id);
    setMenuAbertoId(null);
  };

  const salvarEdicaoModal = () => {
    if(tituloEditado !== ""){
      editarTarefa(tarefaEditandoId, tituloEditado, prioridadeEditada);
      setTarefaEditandoId(null);
      setTituloEditado("");
      setPrioridadeEditada("Média");
    }
  };

  const confirmarConclusao = (id) => {
    let nome = tarefas.find((tarefa) => tarefa.id === id);
    nome = nome.titulo;
    Alert.alert("Concluir tarefa",
      `Marcar '${nome}' como concluída e removê-la da lista?`,
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Concluir", onPress: () => removerTarefa(id)}
      ]
    )
  };

  const pesoPrioridade = {Alta: 3, Média: 2, Baixa: 1};
  const tarefasSorted = [...tarefas].sort(  //organizar as tarefas por prioridade
    (a,b) => pesoPrioridade[b.prioridade] - pesoPrioridade[a.prioridade]
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarefas Pendentes: {tarefas.length}</Text>

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
      {tarefas.length === 0 && (
        <Text style={styles.vazio}>Nenhuma tarefa pendente🎉</Text>
      )}

      <View style={styles.lista}>
        {tarefasSorted.map((tarefa) => (
          <TaskItem key={tarefa.id}
            {...tarefa}
            onChangeStatus = {confirmarConclusao}
            onRemover = {removerTarefa}
            menuAberto={menuAbertoId === tarefa.id}
            onToggleMenu={alternarMenu}
            onIniciarEdicao={iniciarEdicao}
          />
        ))}
      </View>

    <Modal
      visible={tarefaEditandoId !== null}
      transparent={true}
      animationType='fade'
      onRequestClose={() => setTarefaEditandoId(null)}  
    >
      <View style={styles.modalFundo}>
        
        <View style={styles.modalConteudo}>
          <Text style={styles.text}>Modo Edição</Text>
          <View style={styles.prioridadeContainer}>
            {["Alta", "Média", "Baixa"].map((nivel) => (
              <Pressable key={nivel}
                style={[styles.prioridadeBotao, prioridadeEditada === nivel && styles.prioridadeBotaoAtivo]}
                onPress={() => setPrioridadeEditada(nivel)}
              >
                <Text>{nivel}</Text>
              </Pressable>
            ))}
          </View>
          <TextInput
            style={styles.input}
            value={tituloEditado}
            onChangeText={setTituloEditado}
          />
          
          <Pressable style={styles.button} onPress={salvarEdicaoModal}>
            <Text>Salvar</Text>
          </Pressable>
        </View>
      </View>

    </Modal>
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
    marginBottom: 50,
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
    marginBottom: 8,
    width: '100%'
  },
  button: {
    backgroundColor: '#ccc',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
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
    gap: 15,
    paddingLeft: 10,
    
  },
  prioridadeBotao: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
    marginBottom: 8,
  },
  prioridadeBotaoAtivo: {
    backgroundColor: '#b4ddce'
  },
  vazio: {
  textAlign: 'center',
  color: '#6B7280',
  marginTop: 10,
  },
  modalFundo: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  modalConteudo: {
    backgroundColor: 'rgb(246, 238, 5)',
    borderRadius: 12,
    padding: 20,
    width: '85%',
    alignItems: 'center',
  }, 
  text: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  }
});

