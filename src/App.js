import github from "./db";
import {useCallback, useEffect, useState} from "react";
import query from "./Qeury";
import RepoInfo from "./RepoInfo";
import SearchBox from "./SearchBox";
import NavButton from "./NavButton";

function App() {
    let [userName, setUserName] = useState("");
    let [repoLists, setRepoLists] = useState(null);
    let [pageCount, setPageCount] = useState(20);
    let [queryString, setQueryString] = useState("");
    let [totalCount, setTotalCount] = useState(null);

    let [paginationKeyword, setPaginationKeyword] = useState("first");
    let [paginationString, setPaginationString] = useState("");
    let [startCursor, setStartCursor] = useState(null);
    let [endCursor, setEndCursor] = useState(null);
    let [hasPreviousPage, setPreviousPage] = useState(false);
    let [hasNextPage, setHasNextPage] = useState(true);


    const fetchData = useCallback(() => {
        let queryText = JSON.stringify(query(pageCount, queryString, paginationKeyword, paginationString));

        fetch(github.baseUrl, {
            method: "POST",
            headers: github.headers,
            body: queryText

        })
            .then((response) => response.json())
            .then(data => {
                const viewer = data.data.viewer;
                const repos = data.data.search?.edges;
                setUserName(viewer.name);
                setRepoLists(repos);

                setTotalCount(data.data.search?.repositoryCount);
                setStartCursor(data.data.search.pageInfo?.startCursor);
                setEndCursor(data.data.search.pageInfo?.endCursor);
                setHasNextPage(data.data.search.pageInfo?.hasNextPage)
                setPreviousPage(data.data.search.pageInfo?.hasPreviousPage);
            })
            .catch(error => {
                console.log(error);
            });
    }, [pageCount, queryString, paginationKeyword, paginationString]);
    //the deps are the object that we want to watch in order to trigger the useCallback

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="App container mt-5">
            <h1 className="text-primary"><i className="bi bi-diagram-2-fill"></i></h1>
            <p>Hey there {userName}</p>
            <SearchBox
                queryString={queryString}
                pageCount={pageCount}
                totalCount={totalCount}
                onPageCountChange={(myPageCount) => setPageCount(myPageCount)}
                onQueryChange={(myString) => setQueryString(myString)}/>
            <NavButton
                start={startCursor}
                end={endCursor}
                next={hasNextPage}
                previous={hasPreviousPage}
                onPage={(myKeyword, myString) => {
                    setPaginationKeyword(myKeyword);
                    setPaginationString(myString);
                }}/>
            <p>
                <b>search for:</b> {queryString} | <b>Items per page:</b> {pageCount} | <b>Total
                results:</b> {totalCount}
            </p>
            {repoLists && (
                <ul className="list-group list-group-flush">
                    {repoLists.map((repo) => (
                        <RepoInfo key={repo.node.id} repo={repo.node}/>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default App;


