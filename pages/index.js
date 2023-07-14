import {useEffect, useState} from "react";
import {GoSignOut} from "react-icons/go";
import {useAuth} from "@/firebase/auth";
import {useRouter} from "next/router";
import Loader from "@/components/Loader";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, {tableCellClasses} from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    collection,
    addDoc,
    getDocs,
    where,
    query,
    deleteDoc,
    updateDoc,
    doc,
} from "firebase/firestore";
import {db} from "@/firebase/firebase";
import ResponsiveAppBar from "@/components/ResponsiveAppBar";
import Sidebar from "@/components/Sidebar";
import {Icon, styled, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import * as React from "react";
import {Add} from "@mui/icons-material";
import Typography from "@mui/material/Typography";


const StyledTableCell = styled(TableCell)(({theme}) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({theme}) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


export default function Home() {
    const [todoInput, setTodoInput] = useState("");
    const [todos, setTodos] = useState([]);

    const [todoDecInput, setTodoDecInput] = useState("");


    const [openPage, setOpenPage] = useState(false);
    const {signOut, authUser, isLoading} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push("/login");
        }
        if (!!authUser) {
            fetchTodos(authUser.uid);
        }
    }, [authUser, isLoading]);

    /**
     * Fetches all the todos for a given user ID from Firestore and sets the todos state with the data.
     *
     * @param {string} uid - The user ID to fetch todos for.
     * @return {void}
     */
    const fetchTodos = async (uid) => {
        try {
            // Create a Firestore query to fetch all the todos for the user with the given ID.
            const q = query(collection(db, "todos"), where("owner", "==", uid));

            // Execute the query and get a snapshot of the results.
            const querySnapshot = await getDocs(q);

            // Extract the data from each todo document and add it to the data array.
            let data = [];
            querySnapshot.forEach((todo) => {
                console.log(todo);
                data.push({...todo.data(), id: todo.id});
            });


            // Set the todos state with the data array.
            setTodos(data);
            setTodoDecInput(data)
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    const onKeyUp = (event) => {
        if (event?.key === "Enter" && todoInput?.length && todoDecInput.length > 0) {
            addToDo();
        }
    };

    const addToDo = async () => {
        try {
            // Add a new todo document to the "todos" collection in Firestore with the current user's ID,
            // the content of the todo input, and a completed status of false.
            const docRef = await addDoc(collection(db, "todos"), {
                owner: authUser.uid,
                content: todoInput,
                description: todoDecInput,
            });
            // After adding the new todo, fetch all todos for the current user and update the state with the new data.
            fetchTodos(authUser.uid);
            // Clear the todo input field.
            setTodoInput(" ");
            setTodoDecInput(" ");
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    const deleteTodo = async (docId) => {
        try {
            // Delete the todo document with the given ID from the "todos" collection in Firestore.
            await deleteDoc(doc(db, "todos", docId));

            // After deleting the todo, fetch all todos for the current user and update the state with the new data.
            fetchTodos(authUser.uid);
        } catch (error) {
            console.error("An error occurred", error);
        }
    };

    return !authUser ? (
        <Loader/>
    ) : (
        <main className="">
            <div
                className="bg-black text-white w-44 py-4 mt-10 rounded-lg transition-transform hover:bg-black/[0.8] active:scale-90 flex items-center justify-center gap-2 font-medium shadow-md fixed bottom-5 right-5 cursor-pointer"
                onClick={signOut}>
                <GoSignOut size={18}/>
                <span>Logout</span>
            </div>
            <div className="max-w-full mx-auto mt-10 p-8">
                <div className="bg-white -m-6 p-3 sticky top-0">
                    <div className="flex justify-center flex-col items-center">
                        <ResponsiveAppBar/>
                    </div>
                    <Sidebar/>
                    {/*<h3>{`👋 Hello ${authUser.username}, What to do Today?`}</h3>*/}
                    <div className="flex items-center gap-2 mt-30 ml-52">
                        <TableContainer component={Paper}>
                            <Table sx={{minWidth: 700}} aria-label="customized table">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Project Name</StyledTableCell>
                                        <StyledTableCell align="center">Descriptions</StyledTableCell>
                                        <StyledTableCell align="right"><Add
                                            onClick={(e) => setOpenPage(true)}></Add></StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {todos.map((todo) => (
                                        <StyledTableRow key={todo.id}>
                                            <StyledTableCell component="th" scope="row">
                                                {todo.content}
                                            </StyledTableCell>
                                            <StyledTableCell align="center">{todo.description}</StyledTableCell>
                                            <StyledTableCell align="right">
                                                <Button onClick={() => deleteTodo(todo.id)} variant="outlined"
                                                        startIcon={<DeleteIcon/>}>
                                                    Delete
                                                </Button>
                                            </StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <Box sx={{'& > :not(style)': {m: 2,},}}>
                            <Icon baseClassName="fas" className="fa-plus-circle" color=""
                                  onClick={(e) => setOpenPage(true)}/>
                        </Box>
                        <Menu
                            id="demo-positioned-menu"
                            aria-labelledby="demo-positioned-button"
                            open={openPage}
                            PaperProps={{
                                sx: {
                                    width: '800px',
                                    paddingTop: '50'
                                }
                            }}
                            onClose={(e) => setOpenPage(false)}
                            anchorOrigin={{
                                vertical: "center",
                                horizontal: "center",
                            }}
                            transformOrigin={{
                                vertical: "center",
                                horizontal: "center",
                            }}>
                            <MenuItem
                            ><TextField id="outlined-basic"
                                        label="Project Name?"
                                        variant="outlined"
                                        fullWidth="800"
                                        required={true}
                                        value={todoInput}
                                        onChange={(e) => setTodoInput(e.target.value)}
                                        onKeyUp={(e) => onKeyUp(e)}
                            />
                            </MenuItem>
                            <MenuItem> <TextField
                                id="outlined-multiline-static"
                                label="Project Description"
                                fullWidth="800"
                                multiline
                                rows={4}
                                 value={todoDecInput}
                                onChange={(e) => setTodoDecInput(e.target.value)}
                                onKeyUp={(e) => onKeyUp(e)}
                            /></MenuItem>
                            <MenuItem>
                                <Button fullWidth="100" onClick={addToDo} variant="contained" >Save</Button>
                            </MenuItem>
                        </Menu>

                    </div>
                </div>
                <div className="my-10">
                    {todos.length < 1 && (<Typography
                        variant="h4"
                        align="center"
                        color="textSecondary"
                        className="mt-28"
                    >
                        {`🥹 You don't have Project list !`}
                    </Typography>)}
                </div>
            </div>
        </main>
    );
}
