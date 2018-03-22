import React from 'react'
import RX from 'reactxp'

// import Navigator from 'reactxp-navigation'

// let NavigationRouteId = {
//     MainPanel : "MainPanel",
//     SecondPanel: "SecondPanel"
// };

const styles = {
    scroll: RX.Styles.createScrollViewStyle({
        alignSelf: 'stretch',
        backgroundColor: '#f5fcff'
    }),
    container: RX.Styles.createViewStyle({
        padding: 16,
        justifyContent: 'center',
        alignItems: 'center'
    }),
    helloWorld: RX.Styles.createTextStyle({
        fontSize: 48,
        fontWeight: 'bold',
        marginBottom: 28
    }),
    welcome: RX.Styles.createTextStyle({
        fontSize: 32,
        marginBottom: 12
    }),
    instructions: RX.Styles.createTextStyle({
        fontSize: 16,
        color: '#aaa',
        marginBottom: 16
    }),
    docLink: RX.Styles.createLinkStyle({
        fontSize: 16,
        color: 'blue',
        marginBottom: 16
    }),
    roundButton: RX.Styles.createViewStyle({
        margin: 16,
        borderRadius: 16,
        backgroundColor: '#7d88a9'
    }),
    buttonText: RX.Styles.createTextStyle({
        fontSize: 16,
        marginVertical: 6,
        marginHorizontal: 12,
        color: 'white'
    })
};

export default class ReactXpApp extends RX.Component {
    _navigator;

    constructor(props) {
        super(props);
    }

    render() {
        return(
            <RX.View style={styles.container}> 
                <RX.Text style={ styles.welcome }>
                    Welcome to Core ReactXP ..Hello World. this is nuget package.
                    </RX.Text>
            </RX.View>
        )
    }
}
    // "react": "^16.2.0",
    // "react-dom": "^16.2.0",
    // "react-native": "^0.54.2",
    // "reactxp": "^1.0.2"