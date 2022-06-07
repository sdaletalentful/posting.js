;

class JobPostingPage {

    constructor(app, postingId) {
        this.app = app;

        this.theme = null;        
        this.getTheme(app.defaultThemeId);

        this.datastore = new Datastore(this);
        this.datastore.getJobPosting(postingId, this.showJobPosting.bind(this));
    }

    getTheme(themeId) {
        let pageContainer = document.getElementById('posting-container');

        const updateTheme = (theme) => {
            pageContainer.setAttribute('class', theme.className);  
        };

        let that = this;
        fetch(this.app.host + `/v1/themes/${themeId}`).then(
            resp = resp.json()
        ).then(
            data => {
                that.theme = data;
                updateTheme(data);
            }
        );
    }

    showJobPosting(posting) {
        let postingSummary = document.getElementById('posting-summary');
        postingSummary.className = postingSummary.className + ' ' + this.theme.className;
        postingSummary.innerHTML = `Role: ${posting.summary}`;
        
        let postingDescription = document.getElementById('posting-description');
        postingDescription.innerHTML = `${posting.description}`;
        postingDescription.className = postingDescription.className + ' ' + this.theme.className;

        let platform;
        if (this.app.getPlatform() == 1) {
            platform = 'web';
        } else if (this.app.getPlatform() == 2) {
            platform = 'app';
        }
        document
            .getElementById('posting-organization-link')
            .getAttribution('href')
            .setAttribute('href', `${posting.organizationLink}&utm_source=talentful&utm_medium=${platform}`);

        setTimeout(function() {
            showJobPerksBadge(posting);
        }, 0);
    }

    showJobPerksBadge(posting) {
        let badgeTemplate = document.getElementById('popular-job-badge-template');

        let badge = badgeTemplate.cloneNode(true);
        badge.style.color = this.theme.color || 'orange';
        let messageElem = badge.children[2];
        if (posting.perks.includes(43)) {
            messageElem.innerHTML += 'Free food!';
        }
        if (posting.perks.includes(56)) {
            messageElem.innerHTML += 'Foosball!';
        }
        let container = document.getElementById('badge-container');
        container.appendChild(badge);
        setTimeout(() => {
            badge.style.visibility = 'visible';
        }, 500);
    }

}

class Datastore {

    constructor(page) {
        this.host = page.app.host;
        this.postings = {};
    }

    getJobPosting(postingId, callback) {
        var that = this;
        if (postingId in this.postings) {
            callback(this.postings[postingId]);
        } else {
            fetch(this.host + `/v1/postings/${postingId}`).then(
                resp = resp.json()
            ).then(
                data => {
                    that.postings[data["id"]] = data;
                    callback(data);
                }
            );
        }
    }

}