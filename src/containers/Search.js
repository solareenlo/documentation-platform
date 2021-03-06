import lunr from 'lunr';
import PropTypes from 'prop-types';
import React from 'react';
import ReactRouterPropTypes from 'react-router-prop-types';
import { Head, withRouteData, withRouter, withSiteData } from 'react-static';
import InputSearch from '../components//molecules/InputSearch';
import BottomSticky from '../components/atoms/BottomSticky';
import Feedback from '../components/molecules/Feedback';
import Pagination from '../components/molecules/Pagination';
import SearchResult from '../components/molecules/SearchResult';
import SideMenu from '../components/molecules/SideMenu';
import StickyHeader from '../components/organisms/StickyHeader';
import { submitFeedback } from '../utils/api';
import { localStorageSet } from '../utils/localStorage';
import { ProjectsPropTypes, ViewDataPropTypes } from '../utils/propTypes.js';
import { constructSearchQuery, extractSearchQuery, initCorpusIndex } from '../utils/search';
import Container from './Container';

class Search extends React.Component {
    static propTypes = {
        viewData: ViewDataPropTypes.isRequired,
        apiEndpoint: PropTypes.string.isRequired,
        projects: ProjectsPropTypes.isRequired,
        history: ReactRouterPropTypes.history,
        location: ReactRouterPropTypes.location
    };

    constructor(props) {
        super(props);

        this.state = {
            isMenuOpen: false,
            foundResult: [],
            page: 0,
            indexStart: 0,
            indexEnd: 9,
            query: extractSearchQuery(this.props.location)
        };

        this.onSearch = this.onSearch.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.onDataPaginated = this.onDataPaginated.bind(this);
        this.search = this.search.bind(this);
        this.handleBurgerClick = this.handleBurgerClick.bind(this);
    }

    componentDidMount() {
        this.corpusIndex = initCorpusIndex();

        this.search();
        // We must store last path in here as when we create react-static
        // there is no other way of getting where we were for 404 logging
        localStorageSet('lastDocPath', this.props.location.pathname);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.search !== prevProps.location.search) {
            this.setState({ query: extractSearchQuery(this.props.location) }, () => {
                this.search();
            });
        }
    }

    handleBurgerClick() {
        this.setState({ isMenuOpen: !this.state.isMenuOpen });
    }

    onDataPaginated(pageIndex, start, end) {
        this.setState({ page: pageIndex, indexStart: start, indexEnd: end });
        const target = document.querySelector('#search-top');
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    onSearch(query) {
        this.setState({ query }, () => {
            this.search();
        });

        this.props.history.replace(`?${constructSearchQuery(query)}`);
    }

    handleKeyUp(e) {
        if (e.key === 'Escape') {
            this.setState({ inputExpanded: false });
        }
    }

    search() {
        let searchResults;
        if (this.state.query) {
            const idx = lunr.Index.load(this.corpusIndex.index);
            const results = idx.search(`*${this.state.query}*~2`);
            searchResults = results
                .map(result => ({
                    ...this.corpusIndex.documents[result.ref],
                    matches: Object.keys(result.matchData.metadata)
                }));
        }

        if (searchResults && searchResults.length > 0) {
            this.setState({ foundResult: searchResults, indexStart: 0, indexEnd: Math.min(9, searchResults.length - 1) });
        } else {
            this.setState({ foundResult: [], indexStart: 0, indexEnd: 0 });
        }
    }

    render() {
        return (
            <Container {...this.props}>
                <Head>
                    <title>Search Results | {this.props.viewData.siteName}</title>
                </Head>
                <div id="search-top" />
                <StickyHeader
                    history={this.props.history}
                    onBurgerClick={this.handleBurgerClick}
                    viewData={this.props.viewData}
                />
                <SideMenu
                    isMenuOpen={this.state.isMenuOpen}
                    projects={this.props.projects}
                    onCloseClick={this.handleBurgerClick} />
                <section className="sub-header__wrapper">
                    <section className="sub-header">
                        <span className="sub-header__title sub-header-title__fixed">Search results</span>
                    </section>
                </section>
                <div className="layouts--1-column">
                    <div className="middle-column">
                        <div className="input-wrapper-basic">
                            <InputSearch
                                query={this.state.query}
                                className="input-search-basic"
                                placeholder="Search for topics"
                                onKeyUp={this.handleKeyUp}
                                onSearch={this.onSearch}
                            />
                        </div>
                        <SearchResult
                            foundResult={this.state.foundResult}
                            indexStart={this.state.indexStart}
                            indexEnd={this.state.indexEnd}
                            query={this.state.query}
                        />
                        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '30px' }}>
                            <Pagination
                                totalCount={this.state.foundResult && this.state.foundResult.length}
                                onDataPaginated={this.onDataPaginated}
                            />
                        </div>
                    </div>
                    {this.props.viewData.enableFeedback && (
                        <BottomSticky zIndex={10} horizontalAlign='right'>
                            <div className="tablet-down-hidden">
                                <Feedback onSubmit={(data) => submitFeedback(this.props.apiEndpoint, this.props.location.pathname, data)} />
                            </div>
                        </BottomSticky>
                    )}
                </div>
            </Container>
        );
    }
}

export default withSiteData(withRouteData(withRouter(Search)));