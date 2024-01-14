import { Button, makeStyles } from "@material-ui/core"
import { useContext } from 'react'
import { useMoralis } from "react-moralis";

const useStyles = makeStyles((theme) => ({
    container: {
        float: "right",
    }
}))

const ConnectButton = () => {
    const classes = useStyles()
    const { authenticate, logout, isAuthenticated, user } = useMoralis();

    return (
        <div className={classes.container}>
            <div style={{ textAlign: 'center', color: 'white' }}>
                {!isAuthenticated ? (
                    <div>
                        <Button color="primary" variant="contained"
                            onClick={() => authenticate()}>
                            Connect
                </Button>
                    </div>
                ) : (
                        <Button color="primary" variant="contained"
                            onClick={() => logout()}>
                            Disconnect
                        </Button>
                    )}
                {!isAuthenticated ? (
                    <h5 style={{ marginTop: '5px' }}>No user detected</h5>
                ) : (
                        <h6 style={{ marginTop: '5px' }}>{user.get('username')}</h6>
                    )}
            </div>
        </div>
    )
}

export default ConnectButton