<?php

namespace App\Controller;

use App\Entity\Platform;
use App\Form\PlatformType;
use App\Repository\PlatformRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * @Route("/platform")
 */
class PlatformController extends AbstractController
{
    /**
     * @Route("/", name="platform_index", methods={"GET"})
     */
    public function index(PlatformRepository $platformRepository): Response
    {
        return $this->render('platform/index.html.twig', [
            'platforms' => $platformRepository->findAll(),
        ]);
    }

    /**
     * @Route("/new", name="platform_new", methods={"GET", "POST"})
     */
    public function new(Request $request, EntityManagerInterface $entityManager): Response
    {
        $platform = new Platform();
        $form = $this->createForm(PlatformType::class, $platform);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->persist($platform);
            $entityManager->flush();

            return $this->redirectToRoute('platform_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('platform/new.html.twig', [
            'platform' => $platform,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/{id}", name="platform_show", methods={"GET"})
     */
    public function show(Platform $platform): Response
    {
        return $this->render('platform/show.html.twig', [
            'platform' => $platform,
        ]);
    }

    /**
     * @Route("/{id}/edit", name="platform_edit", methods={"GET", "POST"})
     */
    public function edit(Request $request, Platform $platform, EntityManagerInterface $entityManager): Response
    {
        $form = $this->createForm(PlatformType::class, $platform);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $entityManager->flush();

            return $this->redirectToRoute('platform_index', [], Response::HTTP_SEE_OTHER);
        }

        return $this->renderForm('platform/edit.html.twig', [
            'platform' => $platform,
            'form' => $form,
        ]);
    }

    /**
     * @Route("/{id}", name="platform_delete", methods={"POST"})
     */
    public function delete(Request $request, Platform $platform, EntityManagerInterface $entityManager): Response
    {
        if ($this->isCsrfTokenValid('delete'.$platform->getId(), $request->request->get('_token'))) {
            $entityManager->remove($platform);
            $entityManager->flush();
        }

        return $this->redirectToRoute('platform_index', [], Response::HTTP_SEE_OTHER);
    }
}
