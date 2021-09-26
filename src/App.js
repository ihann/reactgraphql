import github from "./db";
import {useEffect, useState, useCallback} from "react";
import query from "./Qeury";
import RepoInfo from "./RepoInfo";

function App() {
    let [userName, setUserName] = useState("");
    let [repoLists, setRepoLists] = useState(null);

    const fetchData = useCallback(() => {
        fetch(github.baseUrl, {
            method: "POST",
            headers: github.headers,
            body: JSON.stringify(query)

        })
            .then((response) => response.json())
            .then(data => {
                let viewer = data.data.viewer;
                let repos = data.data.search.nodes
                setUserName(viewer.name);
                setRepoLists(repos)
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

            {repoLists && (
                <ul className="list-group list-group-flush">
                    {repoLists.map((repo) => (
                        <RepoInfo key={repo.id} repo={repo}/>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;


