import React, {Component} from "react";
import api from "../lib/apiGraphQL";
import RepoCount from "../components/Count";
import {graphql} from "react-apollo";
import {createRepo} from "../queries";
import {Redirect} from "react-router";
import Button from "../styles/Button";
import cookie from "react-cookies";

export class NewRepoForm extends Component {
  state = {
    data: {},
    uri: "",
    contributors: "",
    name: "",
    url: "",
    description: "",
    forks: "",
    owner: "",
    stargazers: "",
    issues: "",
    submitted: false,
  };

  handleNameChange = (e) => {
    this.setState({name: e.target.value});
  }

  handleUrlChange = (e) => {
    this.setState({url: e.target.value});
  }

  handleDescriptionChange = (e) => {
    this.setState({description: e.target.value});
  }

  handleForksChange = (e) => {
    this.setState({forks: e.target.value});
  }

  handleIssuesChange = (e) => {
    this.setState({issues: e.target.value});
  }

  handleStarsChange = (e) => {
    this.setState({stargazers: e.target.value});
  }

  handleOwnerChange = (e) => {
    this.setState({owner: e.target.value});
  }

  handleContributorsChange = (e) => {
    this.setState({contributors: e.target.value});
  }

  handleRepoCreation = () => {
    this.props
      .mutate({
        variables: {...this.state},
        updateQueries: {
          Repository: (prev, {mutationResult}) => {
            const newRepo = mutationResult.data.createRepository;
            return {
              allRepositories: [...prev.repositories, newRepo],
            };
          },
        },
      })
      .then(() => {
        this.setState({
          data: {},
          description: "",
          owner: "",
          stargazers: "",
          forks: "",
          issues: "",
          contributors: "",
          uri: "",
          url: "",
          name: "",
          submitted: true,
        });
      });
  }

  handleSetUrl = (e) => {
    this.setState({url: e.target.value});
  }

  handleFetchRepoData = () => {
    const url = this.state.url.split("/");
    api.fetchRepositoryData(url[3], url[4]).then(response => {
      const data = response.data.data.repositoryOwner.repository;
      const {name, url, description, forks, owner, stargazers, issues} = data;
      this.setState({
        data: data,
        name: name,
        url: url,
        description: description,
        forks: forks.totalCount,
        owner: owner.login,
        stargazers: stargazers.totalCount,
        issues: issues.totalCount,
      });
    });
  }

  render() {
    const {count} = this.props;
    const {contributors, name, url, description, forks, owner, stargazers, issues, submitted} = this.state;

    return !submitted ? (
      <div className="Form">
        <h1 className="title">Enter a GitHub URL</h1>
        <p>Add a url to a GitHub repository you would like to track here and we can fetch the data</p>
        <div className="">
          <div name="">
            <input
              className="utility-input urlForm"
              type="url"
              onChange={this.handleSetUrl}
              value={url}
              placeholder="https://github.com/netlify/netlify-cms"
            />
            <Button onClick={this.handleFetchRepoData}>Fetch repository data</Button>
          </div>
          <div className="grid-full form">
            <input
              className="utility-input support-input-form"
              placeholder="Name"
              onChange={this.handleNameChange}
              value={name}
              type="text"
              name="sitename"
              required
            />
            <input
              className="utility-input boxed-input light-shadow"
              placeholder="Link"
              onChange={this.handleUrlChange}
              value={url}
              type="url"
              name="contentlink"
              required
            />
            <input
              className="utility-input boxed-input light-shadow"
              placeholder="Owner"
              onChange={this.handleOwnerChange}
              value={owner}
              name="repoowner"
              required
            />
            <input
              className="utility-input boxed-input light-shadow"
              placeholder="Contributors"
              onChange={this.handleContributorsChange}
              value={contributors}
              name="contributors"
            />
            <input
              className="utility-input boxed-input light-shadow"
              placeholder="Stars"
              onChange={this.handleStarsChange}
              value={stargazers}
              type="text"
              name="stars"
              required
            />
            <input
              className="utility-input boxed-input light-shadow"
              placeholder="Forks"
              onChange={this.handleForksChange}
              value={forks}
              type="text"
              name="forks"
              required
            />
            <input
              className="utility-input boxed-input light-shadow"
              placeholder="Issues"
              onChange={this.handleIssuesChange}
              value={issues}
              type="text"
              name="issues"
              required
            />
            <textarea
              className="utility-input boxed-input text-box light-shadow"
              onChange={this.handleDescriptionChange}
              value={description}
              type="text"
              placeholder="Repository Description"
              name="notes"
            />
            <RepoCount count={count} />
            <Button onClick={this.handleRepoCreation}>
              <span className="icon-plus" />
              Add repository to your list
            </Button>
          </div>
          <div className="shadow" />
        </div>
      </div>
    ) : (
      <Redirect to="/" />
    );
  }
}

const queryOptions = {
  options: {
    variables: {
      viewerId: cookie.load("openSaucedViewerId")
    }
  }
};
const FormMutation = graphql(createRepo, queryOptions)(NewRepoForm);

export default FormMutation;
