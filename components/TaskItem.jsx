import {View,Text, StyleSheet, Pressable} from 'react-native';


export default function TaskItem({ id, titulo, concluida, onRemover, onChangeStatus }) {

  return (
    <View style={styles.container}>
      <Pressable style={styles.taskItem} onPress={() => onChangeStatus(id)}>
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

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center'
    },
    taskItem: {
        padding: 10,
        backgroundColor: '#fee2e2',
        borderRadius: 50,
    },
    lixeira: {
        padding: 10,
        backgroundColor: '#f2f2f2',
        borderRadius: 8,
    }
})