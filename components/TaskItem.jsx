import {View,Text, StyleSheet, Pressable} from 'react-native';


export default function TaskItem({ id, titulo, concluida, prioridade, onRemover, onChangeStatus }) {

  return (
    <View style={[styles.container]}>
      <Pressable 
        style={[styles.taskItem, { borderLeftColor: coresPrioridade[prioridade], borderLeftWidth: 4 }]} 
        onPress={() => onChangeStatus(id)}>
        <Text> 
          {concluida ? "✅" : "⬜"} {titulo}
        </Text>
      </Pressable>
      <Pressable style={styles.lixeira} onPress={() => onRemover(id)}>
        <Text>🗑️</Text>
      </Pressable>
    </View>
  );
}

const coresPrioridade = {
  Alta: '#EF4444',
  Média: '#F59E0B',
  Baixa: '#10B981',
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskItem: {
        padding: 10,
        backgroundColor: '#f3eeee',
        borderRadius: 8,
    },
    lixeira: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 50,
    }
})