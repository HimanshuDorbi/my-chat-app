import React, { useEffect, useState, useRef } from "react";
import {
  Box,
  HStack,
  Input,
  Button,
  Container,
  VStack,
  Card,
  Avatar,
  Text
} from "@chakra-ui/react";
import Message from "./Components/Message";
import { app } from "./firebase";
import {
  getAuth,
  GithubAuthProvider,
  onAuthStateChanged,
  GoogleAuthProvider,
  signOut,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, addDoc, collection, serverTimestamp, query, orderBy, onSnapshot,deleteDoc,doc } from "firebase/firestore";

const auth = getAuth(app);
const db = getFirestore(app);

const loginHandler = () => {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider);
};

const logoutHandler = () => {
  signOut(auth);
};

function App() {
  const q = query(collection(db, "Messages"), orderBy("createdAt", "asc"));
  const [user, setUser] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const divforScroll = useRef(null);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      setMessage("");
      await addDoc(collection(db, "Messages"), {
        text: message,
        uid: user.uid,
        uri: user.photoURL,
        createdAt: serverTimestamp(),
      });
      divforScroll.current.scrollIntoView({ behaviour: "smooth" });
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (data) => {
      setUser(data);
    });

    const unsubscribeForMessage = onSnapshot(q, (snap) => {
      setMessages(
        snap.docs.map((item) => {
          const id = item.id;
          const data = item.data();
          const createdAt = data.createdAt ? data.createdAt.toMillis() : null; // Check if createdAt is not null before accessing toMillis()
          return { id, ...data, createdAt };
        })
      );
    });

    return () => {
      unsubscribe();
      unsubscribeForMessage();
    };
  }, []);

  const deleteMessage = async (id) => {
    try {
      await deleteDoc(doc(db, "Messages", id)); // Assuming "Messages" is the collection name
    } catch (error) {
      alert("Error deleting message");
    }
  };

  return (
    <Box bg="red.50">
      {user ? (
        <Container h="100vh" bg="white">
          <VStack h="full" paddingY="4">
            <Card padding="4" boxShadow="base">
              
              <Text fontSize="xl">Welcome, {user.displayName}!</Text>
              <Avatar src={user.photoURL} size="lg" name={user.displayName} />
              <Text fontSize="sm" color="gray.500" mb="2">
                Made with ❤️ by Himanshu Dorbi
              </Text>
              <Button onClick={logoutHandler} colorScheme="red" w="full" mt="4">
                Logout
              </Button>
            </Card>
            <VStack
              h="full"
              width="full"
              overflowY="auto"
              css={{
                "&::-webkit-scrollbar": {
                  display: "none",
                },
              }}
            >
              {messages.map((item) => (
                <Message
                  key={item.id}
                  user={item.uid === user.uid ? "me" : "other"}
                  text={item.text}
                  uri={item.uri}
                  createdAt={item.createdAt}
                  onDelete={deleteMessage}
                />
              ))}
            </VStack>
            <div ref={divforScroll}></div>
            <form onSubmit={submitHandler} style={{ width: "100%" }}>
              <HStack>
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="enter the message..."
                />
                <Button colorScheme="purple" type="submit">
                  Send
                </Button>
              </HStack>
            </form>
          </VStack>
        </Container>
      ) : (
        <VStack alignItems="center" justifyContent="center" h="100vh">
          <Text fontSize="3xl" fontWeight="bold" mb="4">
            Welcome to the Chat App
          </Text>
          <Button onClick={loginHandler} colorScheme="purple">
            Sign in with your Google account
          </Button>
          <Text fontSize="sm" color="gray.500" mt="2">
            Made with ❤️ by Himanshu Dorbi
          </Text>
        </VStack>
      )}
    </Box>
  );
}

export default App;
