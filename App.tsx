import { useEffect, useState } from 'react'
import { Keyboard, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import Task from './components/Task'
import { useAsyncStorage } from '@react-native-async-storage/async-storage'

export default function App () {
  const [task, setTask] = useState('')
  const [taskItems, setTaskItems] = useState<string[]>([])

  const { getItem, setItem } = useAsyncStorage('taskItems')

  useEffect(() => {
    const restoreTasks = async () => {
      const storedTasksString = await getItem()
      const storedTasks = storedTasksString != null
        ? JSON.parse(storedTasksString)
        : []
      setTaskItems(storedTasks)
    }

    restoreTasks()
      .catch(console.error)
  }, [])

  useEffect(() => {
    const storeTasks = async () => {
      const tasksString = JSON.stringify(taskItems)
      setItem(tasksString)
    }

    storeTasks()
      .catch(console.error)
  }, [taskItems])

  const handleAddTask = async () => {
    if (task === '') return

    Keyboard.dismiss()
    setTaskItems([...taskItems, task])
    setTask('')
  }

  const completeTask = async (index: number) => {
    const itemsCopy = [...taskItems]
    itemsCopy.splice(index, 1)
    setTaskItems(itemsCopy)
  }

  return (
    <View style={styles.container}>

      {/* Today's Tasks */}
      <View style={styles.tasksWrapper}>
        <Text style={styles.sectionTitle}>Today's tasks</Text>
        <View style={styles.items}>
          {taskItems.map((task, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => completeTask(index)}>
                <Task text={task} />
              </TouchableOpacity>
            )
          })}
        </View>
      </View>

      {/* Write a Task */}
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.writeTaskWrapper}>
        <TextInput style={styles.input} placeholder={'Write a task'} value={task} onChangeText={text => setTask(text)} />
        <TouchableOpacity onPress={handleAddTask}>
          <View style={styles.addWrapper}>
            <Text style={styles.addText}>+</Text>
          </View>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E8EAED'
  },
  tasksWrapper: {
    paddingTop: 80,
    paddingHorizontal: 20
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  items: {
    marginTop: 30
  },
  writeTaskWrapper: {
    position: 'absolute',
    bottom: 60,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  input: {
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
    borderRadius: 60,
    borderColor: '#C0C0C0',
    borderWidth: 1,
    width: 250
  },
  addWrapper: {
    width: 60,
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#C0C0C0',
    borderWidth: 1
  },
  addText: {}
})
