import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExperienceDto } from './dto/create-experience.dto';
import { UpdateExperienceDto } from './dto/update-experience.dto';
import { Experience } from './entities/experience.entity';

@Injectable()
export class ExperiencesService {
  constructor(
    @InjectRepository(Experience)
    private experiencesRepository: Repository<Experience>,
  ) {}

  create(createExperienceDto: CreateExperienceDto): Promise<Experience> {
    const experience = this.experiencesRepository.create(createExperienceDto);
    return this.experiencesRepository.save(experience);
  }

  findAll(): Promise<Experience[]> {
    return this.experiencesRepository.find({ relations: ['slots'] });
  }

  async findOne(id: number): Promise<Experience> {
    const experience = await this.experiencesRepository.findOne({
      where: { id },
      relations: ['slots'],
    });
    if (!experience) {
      throw new NotFoundException('Experience not found');
    }
    return experience;
  }

  async update(
    id: number,
    updateExperienceDto: UpdateExperienceDto,
  ): Promise<Experience> {
    await this.findOne(id); // Check if experience exists
    await this.experiencesRepository.update(id, updateExperienceDto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.experiencesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('Experience not found');
    }
  }
}
