---
title: "How to optimize images"
date: "2023-07-10T22:12:03.284Z"
description: "Need a quick TLDR about optimizing images, then check your format, image size, and use the correct images per browser."
featuredImage: "whatsTheDeal.png"
---

Optimizing images is one of the simplest and biggest wins you can be tasked with when working on a site. In most cases you just need to do the following:

* Make sure the image served is the right size, so it doesn't need to be adjusted to fit on the frontend
* Make sure you use the right file format for the job, at the time of writing .webp is the best
* Lastly have code to double check you are using a file format supported by the users internet browser

The rest of the article is a deep dive on why the above works, read on if your curious why the above works.

# Why does this help you
The reason why we need to double check the image size is due the network. Not everyone hosts sites on the best sever nearest to the user. The user might not have the best wifi, so if the use lives far away from the server and has a poor connection, then the image would take a bit to download and load. So downloading a 4k image with 2000px width, 2000px height, might not be the best idea if you use it as a small menu icon. Sence more work needs to be done to transform the image to fit to the smaller footprint. If this image does not have a sit width and height, then once the image is downloaded the site might have a layoutshift, showing down site again.

## Layoutshit?
A layoutshift is simple in concept, when a you sever a site to use. A inital html with css is sent to the user without any images or JS code. This is why sometimes you see a site load up, but you can't interact with it for a bit. This initial code sent to the user is meant to be a skelton of the site, then the mucsules of the images, JS code, and everything else that makes a site works is sent in a future call to the host. If the skelton of the site does not account for the size of the incoming rescoures, then user needs to recalulate how the complents of the site needs to be layout to account for the new rescoures. This is a cost that can easly be avoided, this becomes more impactfull the larger the site and more often it happens.