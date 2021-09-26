import github from "./db";
import {useEffect, useState, useCallback} from "react";
import query from "./Qeury";

function App() {
    let [userName, setUserName] = useState("");

    const fetchData = useCallback(() => {
        fetch(github.baseUrl, {
            method: "POST",
            headers: github.headers,
            body: JSON.stringify(query)

        })
            .then((response) => response.json())
            .then(data => {
                setUserName(data.data.viewer.name);
                console.log(data)
            })
            .catch(error => {
                console.log(error);
            });
    }, []);
    //the deps are the object that we want to watch in order to trigger the useCallback


    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="App container mt-5">
            <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i></h1>
            <p>Hey there {userName}</p>
        </div>
    );
}

export default App;


