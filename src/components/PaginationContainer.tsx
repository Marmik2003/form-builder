
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface PaginatorProps {
    count: number,
    limit: number,
    activePage: number,
    onPageChange: (page: number) => void
}

export default function PaginationContainer(props: PaginatorProps) {
    const { limit, count, activePage, onPageChange } = props;

    return (
        <div className="bg-white mt-2 px-4 py-3 flex items-center justify-between border-t border-b border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700">
                        Showing <span className="font-medium">{ activePage }</span> to <span className="font-medium">{ Math.ceil(count / limit) }</span> of{' '}
                        <span className="font-medium">{count}</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button
                            type="button"
                            disabled={activePage === 1}
                            onClick={_ => onPageChange(activePage - 1)}
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </button>
                        
                        {[...Array(Math.ceil(count / limit))].map((_, page) => (
                            <button
                                key={page}
                                type="button"
                                aria-current="page"
                                onClick={_ => onPageChange(page + 1)}
                                className={`bg-white border-gray-300 text-gray-500 relative inline-flex items-center px-4 py-2 border text-sm font-medium ${activePage === page + 1 ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600" : "hover:bg-gray-100"}`}
                            >
                                { page + 1 }
                            </button>
                        ))}

                        <button
                            type="button"
                            disabled={activePage === Math.ceil(count / limit)}
                            onClick={_ => onPageChange(activePage + 1)}
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <FontAwesomeIcon icon={faArrowRight} />
                        </button>
                    </nav>
                </div>
            </div>
        </div>
    )
}