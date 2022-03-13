import React, { PropsWithChildren, useState } from "react";
import { Card, Title, Paragraph, Button, Text } from "react-native-paper";
import VideoPopup from "./VideoPopup";
import VPIcon from "./VPIcon";

interface props {
    item: singleItem;
}
export default function ShopItem(props: PropsWithChildren<props>) {
    const [videoShown, setVideoShown] = useState(false);
    const showVideo = () => {
        setVideoShown(true);
    };

    return (
        <>
            <Card
                style={{
                    marginLeft: 15,
                    marginRight: 15,
                    marginBottom: 10,
                    borderRadius: 10,
                    backgroundColor: "#3d405b",
                }}
            >
                <Card.Content
                    style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        backgroundColor: "#7E1946",
                        borderRadius: 10,
                    }}
                >
                    <Title
                        style={{
                            color: "white",
                            marginBottom: 12,
                        }}
                    >
                        {props.item.displayName}
                    </Title>
                    <Paragraph
                        style={
                            {
                                color: "white",
                            }
                        }
                    >
                        {props.item.price} <VPIcon color="white" />
                    </Paragraph>
                </Card.Content>
                <Card.Cover
                    resizeMode="contain"
                    style={{ padding: 20, backgroundColor: "#3d405b" }}
                    source={{ uri: props.item.displayIcon }}
                />
                <Card.Actions>
                    <Button
                        style={{
                            backgroundColor: "#7E1946",
                            borderRadius: 10,
                            margin: 5,
                        }}
                        onPress={showVideo}
                        disabled={props.item.streamedVideo == null}
                    >
                        Video
                    </Button>
                </Card.Actions>
            </Card>
            <VideoPopup
                videoUri={props.item.streamedVideo}
                visible={videoShown}
                setVisible={setVideoShown}
            />
        </>
    );
}
