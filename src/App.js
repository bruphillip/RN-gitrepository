import React, { Component } from 'react'
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, AsyncStorage } from 'react-native';
import { Repo, NewRepoModal } from './components'


class App extends Component {
    state = {
        modalVisible: false,
        repos: [

        ]
    }

    async componentDidMount() {
        const repos = JSON.parse(await AsyncStorage.getItem('@Minicurso:repositories'))
        if (repos) {
            this.setState({ repos })
        }
    }

    _addRepository = async (newRepoText) => {
        const repoCall = await fetch(`http://api.github.com/repos/${newRepoText}`)
        const response = await repoCall.json()

        const repository = {
            id: response.id,
            thumbnail: response.owner.avatar_url,
            title: response.name,
            author: response.owner.login,
        }

        this.setState({
            modalVisible: false,
            repos: [
                ...this.state.repos,
                repository
            ]
        })
        await AsyncStorage.setItem('@Minicurso:repositories', JSON.stringify(this.state.repos))
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>Minicurso GoNative</Text>
                    <TouchableOpacity onPress={() => { this.setState({ modalVisible: true }) }}>
                        <Text style={styles.headerButton}>+</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView contentContainerStyle={styles.repoList}>
                    {this.state.repos.map(repo => <Repo key={repo.id} data={repo} />)}
                </ScrollView>
                <NewRepoModal onAdd={this._addRepository} onCancel={() => this.setState({ modalVisible: false })} visibilidade={this.state.modalVisible} />

            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#333'
    },
    header: {
        height: (Platform.OS === 'ios') ? 70 : 50,
        paddingTop: (Platform.OS === 'ios') ? 20 : 0,
        backgroundColor: '#FFF',
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    headerButton: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    repoList: {
        padding: 20,
    },
})

export default App