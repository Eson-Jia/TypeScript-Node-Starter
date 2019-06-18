"use strict";

import async from "async";
import request from "request";
import graph from "fbgraph";
import { Response, Request, NextFunction } from "express";
import GitHub from "@octokit/rest";


/**
 * GET /api
 * List of API examples.
 */
export let getApi = (req: Request, res: Response) => {
    res.render("api/index", {
        title: "API Examples"
    });
};

/**
 * GET /api/facebook
 * Facebook API example.
 */
export let getFacebook = (req: Request, res: Response, next: NextFunction) => {
    const token = req.user.tokens.find((token: any) => token.kind === "facebook");
    graph.setAccessToken(token.accessToken);
    graph.get(`${req.user.facebook}?fields=id,name,email,first_name,last_name,gender,link,locale,timezone`, (err: Error, results: graph.FacebookUser) => {
        if (err) { return next(err); }
        res.render("api/facebook", {
            title: "Facebook API",
            profile: results
        });
    });
};


/**
 * GET /api/github
 * GitHub API Example.
 */
export let getGithub = async (req: Request, res: Response, next: NextFunction) => {
    const github = new GitHub();
    try {
        const { data: repo } = await github.repos.get({ owner: "sahat", repo: "hackathon-starter" });
        res.render("api/github", {
            title: "GitHub API",
            repo
        });
    } catch (error) {
        next(error);
    }
};
