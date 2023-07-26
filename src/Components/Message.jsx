import React from "react";
import { HStack, Avatar, Text, IconButton } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons"; 
const Message = ({ id,text, uri, user = "other", createdAt, onDelete}) => {
  const isMe = user === "me";

  // Helper function to format the timestamp
  function formatTimestamp(timestamp) {
    // Your timestamp formatting logic here...
    // For example, you can use libraries like "date-fns" or "moment" for advanced formatting.
    // Or you can write your own logic to format the timestamp as per your requirements.

    // For demonstration purposes, we'll use a simple format:
    const date = new Date(timestamp);
    return date.toLocaleString(); // Change this to your preferred date/time format
  }

  return (
    <HStack
      alignSelf={user === "me" ? "flex-end" : "flex-start"}
      borderRadius={"base"}
      bg={user === "me" ? "green.600" : "gray.100"}
      color={user === "me" ? "white" : "black"}
      paddingY={"2"}
      paddingX={user === "me" ? "4" : "2"}
      boxShadow="md" // Add a subtle box-shadow for depth effect
      transition="background-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out" // Add transitions for smoother appearance
      _hover={{
        // Apply hover styles
        boxShadow: "lg",
      }}
    >
      {user === "other" && <Avatar src={uri} />}
      <Text>{text}</Text>
      {user === "me" && <Avatar src={uri} />}

      <Text fontSize="xs" color={isMe ? "whiteAlpha.800" : "gray.600"} mt="1">
        {isMe ? "Sent " : "Received "} {formatTimestamp(createdAt)}
      </Text>
      {isMe && (
        <IconButton
          aria-label="Delete"
          icon={<DeleteIcon />}
          size="sm"
          colorScheme="red"
          onClick={() => onDelete(id)} // Call the onDelete function when delete button is clicked
        />
      )}
    </HStack>
  );
};

export default Message;
