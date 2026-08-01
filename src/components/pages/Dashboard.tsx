import ArticleProgressTimeline from "../dashboard/ArticleProgressTimeline"
import ArticleStats from "../dashboard/ArticleStats"


function Dashboard() {
    return (
        <div className="max-w-screen lg:pr-4">
            <ArticleStats/>
            <ArticleProgressTimeline/>
        </div>
    )
}

export default Dashboard
