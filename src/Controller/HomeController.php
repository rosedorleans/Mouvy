<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class HomeController extends AbstractController
{
    /**
     * @Route("", name="home")
     */
    public function index(): Response
    {
        return $this->render('home/index.html.twig');
    }

    /**
     * @Route("/platforms", name="platforms")
     */
    public function platforms(): Response
    {
        return $this->render('pages/platforms.html.twig');
    }

    /**
     * @Route("/movies", name="movies")
     */
    public function movies(): Response
    {
        return $this->render('pages/movies.html.twig');
    }

    /**
     * @Route("/movie", name="movie")
     */
    public function movie(): Response
    {
        return $this->render('pages/movie.html.twig');
    }

}
